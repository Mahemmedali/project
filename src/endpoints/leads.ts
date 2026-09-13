import type { Endpoint, PayloadRequest } from 'payload'
import { layout, sendMail } from '@/lib/email'
import { verifyTurnstile } from '@/lib/turnstile'
import { clientIp, rateLimit } from '@/lib/rate-limit'

const SERVICES = ['display', 'native', 'sponsored', 'newsletter', 'corporate', 'event'] as const
const BUDGETS = ['b1', 'b2', 'b3', 'b4'] as const
const json = (data: unknown, status = 200) => Response.json(data, { status })
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!)

/** POST /api/leads — B2B reklam sorğusu → b2b_leads + satış komandasına e-poçt */
export const createLead: Endpoint = {
  path: '/leads',
  method: 'post',
  handler: async (req: PayloadRequest) => {
    const ip = clientIp(req.headers)
    if (!rateLimit(`lead:${ip}`, 3, 10 * 60_000)) return json({ error: 'rate_limited' }, 429)
    const b = (await req.json?.()) as Record<string, string | undefined> | undefined
    if (!b) return json({ error: 'bad_request' }, 400)
    if (!(await verifyTurnstile(b.turnstileToken, ip))) return json({ error: 'captcha' }, 400)

    const company = b.company?.trim() ?? ''
    const contact = b.contact?.trim() ?? ''
    const email = b.email?.trim().toLowerCase() ?? ''
    const service = SERVICES.find((s) => s === b.service)
    const errors: Record<string, string> = {}
    if (!company) errors.company = 'required'
    if (!contact) errors.contact = 'required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'invalid'
    if (!service) errors.service = 'required'
    if (Object.keys(errors).length) return json({ error: 'validation', fields: errors }, 400)
    // honeypot
    if (b.website) return json({ ok: true })

    const lead = await req.payload.create({
      collection: 'b2b-leads',
      data: {
        company,
        contact,
        email,
        phone: b.phone?.trim() || undefined,
        service: service!,
        budget: BUDGETS.find((x) => x === b.budget),
        message: b.message?.trim().slice(0, 4000) || undefined,
        locale: b.locale,
        status: 'new',
      },
      overrideAccess: true,
    })

    const to = process.env.SALES_EMAIL ?? 'reklam@goodmorningbaku.com'
    const adminUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/admin/collections/b2b-leads/${lead.id}`
    await sendMail({
      to,
      replyTo: email,
      subject: `Yeni reklam sorğusu: ${company} — ${service}`,
      html: layout({
        title: 'Yeni reklam sorğusu',
        body: `<table cellpadding="6" style="font-size:15px">
<tr><td><b>Şirkət</b></td><td>${esc(company)}</td></tr>
<tr><td><b>Əlaqə</b></td><td>${esc(contact)}</td></tr>
<tr><td><b>E-poçt</b></td><td>${esc(email)}</td></tr>
<tr><td><b>Telefon</b></td><td>${esc(b.phone ?? '—')}</td></tr>
<tr><td><b>Xidmət</b></td><td>${service}</td></tr>
<tr><td><b>Büdcə</b></td><td>${b.budget ?? '—'}</td></tr>
<tr><td valign="top"><b>Mesaj</b></td><td>${esc(b.message ?? '—')}</td></tr>
</table><p style="margin-top:16px"><a href="${adminUrl}">CMS-də aç</a></p>`,
        footer: 'Good Morning Baku · B2B sorğu bildirişi',
      }),
    })
    return json({ ok: true, id: lead.id })
  },
}
