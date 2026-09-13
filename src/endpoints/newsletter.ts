import { randomBytes } from 'crypto'
import type { Endpoint, PayloadRequest } from 'payload'
import { button, layout, sendBatch, sendMail } from '@/lib/email'
import { verifyTurnstile } from '@/lib/turnstile'
import { clientIp, rateLimit } from '@/lib/rate-limit'
import { locales, type Locale } from '@/i18n/routing'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
const json = (data: unknown, status = 200) => Response.json(data, { status })
const isLocale = (v: unknown): v is Locale => typeof v === 'string' && (locales as readonly string[]).includes(v)

const T = {
  az: {
    confirmSubject: 'Abunəliyi təsdiqləyin — Good Morning Baku',
    confirmTitle: 'Bir addım qaldı',
    confirmBody: 'Səhər bülletenimizə abunə olmaq üçün aşağıdakı düyməyə klikləyin. Bu sorğunu siz göndərməmisinizsə, məktubu nəzərə almayın.',
    confirmBtn: 'Abunəliyi təsdiqlə',
    footer: 'Good Morning Baku · Bakı. Bu məktub abunə sorğunuza cavab olaraq göndərilib.',
    digestSubject: (d: string) => `Sabahınız xeyir, Bakı — ${d}`,
    digestTitle: 'Sabahınız xeyir, Bakı',
    digestIntro: 'Bu səhər bilməli olduğunuz xəbərlər — üç dəqiqəyə.',
    readMore: 'Ətraflı',
    unsub: 'Abunəlikdən çıx',
    bulletenPath: '/az/bulleten',
  },
  en: {
    confirmSubject: 'Confirm your subscription — Good Morning Baku',
    confirmTitle: 'One more step',
    confirmBody: 'Click the button below to confirm your subscription to our morning newsletter. If you did not request this, ignore this email.',
    confirmBtn: 'Confirm subscription',
    footer: 'Good Morning Baku · Baku. This email was sent in response to your subscription request.',
    digestSubject: (d: string) => `Good morning, Baku — ${d}`,
    digestTitle: 'Good morning, Baku',
    digestIntro: 'What you need to know this morning — in three minutes.',
    readMore: 'Read more',
    unsub: 'Unsubscribe',
    bulletenPath: '/en/newsletter',
  },
  ru: {
    confirmSubject: 'Подтвердите подписку — Good Morning Baku',
    confirmTitle: 'Остался один шаг',
    confirmBody: 'Нажмите кнопку ниже, чтобы подтвердить подписку на утреннюю рассылку. Если вы не отправляли запрос, проигнорируйте письмо.',
    confirmBtn: 'Подтвердить подписку',
    footer: 'Good Morning Baku · Баку. Письмо отправлено в ответ на ваш запрос подписки.',
    digestSubject: (d: string) => `Доброе утро, Баку — ${d}`,
    digestTitle: 'Доброе утро, Баку',
    digestIntro: 'Что нужно знать этим утром — за три минуты.',
    readMore: 'Подробнее',
    unsub: 'Отписаться',
    bulletenPath: '/ru/rassylka',
  },
} satisfies Record<Locale, unknown>

/** POST /api/newsletter — abunə sorğusu (double opt-in) */
export const subscribe: Endpoint = {
  path: '/newsletter',
  method: 'post',
  handler: async (req: PayloadRequest) => {
    const ip = clientIp(req.headers)
    if (!rateLimit(`nl:${ip}`, 5, 10 * 60_000)) return json({ error: 'rate_limited' }, 429)
    const body = (await req.json?.()) as { email?: string; locale?: string; source?: string; turnstileToken?: string } | undefined
    const email = body?.email?.trim().toLowerCase() ?? ''
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: 'invalid_email' }, 400)
    if (!(await verifyTurnstile(body?.turnstileToken, ip))) return json({ error: 'captcha' }, 400)
    const locale: Locale = isLocale(body?.locale) ? body!.locale! : 'az'
    const t = T[locale]

    const existing = await req.payload.find({ collection: 'newsletter-subscribers', where: { email: { equals: email } }, limit: 1, overrideAccess: true })
    const found = existing.docs[0]
    if (found?.status === 'confirmed') return json({ ok: true, status: 'confirmed' })

    const token = randomBytes(24).toString('hex')
    if (found) {
      await req.payload.update({ collection: 'newsletter-subscribers', id: found.id, data: { token, locale, status: 'pending', source: body?.source }, overrideAccess: true })
    } else {
      await req.payload.create({ collection: 'newsletter-subscribers', data: { email, locale, status: 'pending', token, source: body?.source ?? 'site' }, overrideAccess: true })
    }

    const url = `${SITE_URL}/api/newsletter/confirm?token=${token}`
    await sendMail({
      to: email,
      subject: t.confirmSubject,
      html: layout({ locale, title: t.confirmTitle, body: `<p style="font-size:16px;line-height:1.6;margin:0 0 20px">${t.confirmBody}</p>${button(t.confirmBtn, url)}`, footer: t.footer }),
      text: `${t.confirmTitle}\n\n${t.confirmBody}\n${url}`,
    })
    return json({ ok: true, status: 'pending' })
  },
}

/** GET /api/newsletter/confirm?token= */
export const confirm: Endpoint = {
  path: '/newsletter/confirm',
  method: 'get',
  handler: async (req: PayloadRequest) => {
    const token = req.searchParams.get('token') ?? ''
    if (!token) return Response.redirect(`${SITE_URL}/az/bulleten?confirmed=0`, 302)
    const r = await req.payload.find({ collection: 'newsletter-subscribers', where: { token: { equals: token } }, limit: 1, overrideAccess: true })
    const sub = r.docs[0]
    if (!sub) return Response.redirect(`${SITE_URL}/az/bulleten?confirmed=0`, 302)
    await req.payload.update({ collection: 'newsletter-subscribers', id: sub.id, data: { status: 'confirmed', confirmedAt: new Date().toISOString() }, overrideAccess: true })
    const locale: Locale = isLocale(sub.locale) ? sub.locale : 'az'
    return Response.redirect(`${SITE_URL}${T[locale].bulletenPath}?confirmed=1`, 302)
  },
}

/** GET /api/newsletter/unsubscribe?token= */
export const unsubscribe: Endpoint = {
  path: '/newsletter/unsubscribe',
  method: 'get',
  handler: async (req: PayloadRequest) => {
    const token = req.searchParams.get('token') ?? ''
    const r = await req.payload.find({ collection: 'newsletter-subscribers', where: { token: { equals: token } }, limit: 1, overrideAccess: true })
    const sub = r.docs[0]
    if (sub) await req.payload.update({ collection: 'newsletter-subscribers', id: sub.id, data: { status: 'unsubscribed' }, overrideAccess: true })
    const locale: Locale = sub && isLocale(sub.locale) ? sub.locale : 'az'
    return Response.redirect(`${SITE_URL}${T[locale].bulletenPath}?unsubscribed=1`, 302)
  },
}

/**
 * GET|POST /api/newsletter/send — səhər xülasəsi (Vercel Cron: hər iş günü 03:30 UTC = 07:30 Bakı)
 * Authorization: Bearer CRON_SECRET
 */
async function sendDigest(req: PayloadRequest) {
  const auth = req.headers.get('authorization') ?? ''
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) return json({ error: 'unauthorized' }, 401)

  const since = new Date(Date.now() - 24 * 3600_000).toISOString()
  const dateLabel = new Intl.DateTimeFormat('az-Latn-AZ', { day: 'numeric', month: 'long', timeZone: 'Asia/Baku' }).format(new Date())
  const result: Record<string, { sent: number; failed: number }> = {}

  for (const locale of locales) {
    const t = T[locale]
    const subs = await req.payload.find({ collection: 'newsletter-subscribers', where: { and: [{ status: { equals: 'confirmed' } }, { locale: { equals: locale } }] }, limit: 5000, overrideAccess: true })
    if (!subs.totalDocs) continue
    const arts = await req.payload.find({
      collection: 'articles',
      locale,
      fallbackLocale: false,
      where: { and: [{ _status: { equals: 'published' } }, { publishedAt: { greater_than: since } }, { title: { exists: true } }] },
      sort: '-publishedAt',
      limit: 5,
      depth: 1,
      overrideAccess: true,
    })
    const items = arts.docs.filter((a) => a.title)
    if (!items.length) continue

    const list = items
      .map((a) => {
        const cat = typeof a.category === 'object' ? a.category : null
        const url = `${SITE_URL}/${locale}/${cat?.slug}/${a.slug}`
        return `<tr><td style="padding:12px 0;border-top:1px solid #DCE0F0"><div style="font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#0424D9">${cat?.name ?? ''}</div><a href="${url}" style="font-family:Georgia,serif;font-size:18px;font-weight:700;color:#03178C;text-decoration:none">${a.title}</a><p style="margin:6px 0 0;font-size:14px;line-height:1.5;color:#5B6280">${a.excerpt ?? ''}</p></td></tr>`
      })
      .join('')
    const mails = subs.docs.map((s) => ({
      to: s.email,
      subject: t.digestSubject(dateLabel),
      html: layout({
        locale,
        title: t.digestTitle,
        body: `<p style="font-size:16px;line-height:1.6;margin:0 0 8px">${t.digestIntro}</p><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${list}</table>`,
        footer: `${t.footer} · <a href="${SITE_URL}/api/newsletter/unsubscribe?token=${s.token}" style="color:#5B6280">${t.unsub}</a>`,
      }),
    }))
    const r = await sendBatch(mails)
    result[locale] = r
    await req.payload.create({
      collection: 'newsletters',
      locale,
      data: { subject: t.digestSubject(dateLabel), articles: items.map((a) => a.id), sentAt: new Date().toISOString(), stats: { sent: r.sent, failed: r.failed } },
      overrideAccess: true,
    })
  }
  return json({ ok: true, result })
}

export const sendGet: Endpoint = { path: '/newsletter/send', method: 'get', handler: sendDigest }
export const sendPost: Endpoint = { path: '/newsletter/send', method: 'post', handler: sendDigest }
