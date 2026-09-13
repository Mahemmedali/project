import { Resend } from 'resend'

const FROM = process.env.EMAIL_FROM ?? 'Good Morning Baku <hello@goodmorningbaku.com>'

let client: Resend | null = null
function resend() {
  if (!process.env.RESEND_API_KEY) return null
  return (client ??= new Resend(process.env.RESEND_API_KEY))
}

export interface Mail {
  to: string | string[]
  subject: string
  html: string
  text?: string
  replyTo?: string
}

/** RESEND_API_KEY yoxdursa məktub konsola yazılır (dev rejimi) */
export async function sendMail(mail: Mail): Promise<{ ok: boolean; id?: string; error?: string }> {
  const r = resend()
  if (!r) {
    console.info(`[email:dev] → ${Array.isArray(mail.to) ? mail.to.join(', ') : mail.to}\n  ${mail.subject}\n  ${mail.text ?? mail.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 400)}`)
    return { ok: true, id: 'dev' }
  }
  const { data, error } = await r.emails.send({ from: FROM, to: mail.to, subject: mail.subject, html: mail.html, text: mail.text, replyTo: mail.replyTo })
  if (error) return { ok: false, error: error.message }
  return { ok: true, id: data?.id }
}

/** Toplu göndəriş (Resend batch: ≤100 məktub / çağırış) */
export async function sendBatch(mails: Mail[]): Promise<{ sent: number; failed: number }> {
  const r = resend()
  if (!r) {
    console.info(`[email:dev] batch ×${mails.length}: ${mails[0]?.subject}`)
    return { sent: mails.length, failed: 0 }
  }
  let sent = 0
  let failed = 0
  for (let i = 0; i < mails.length; i += 100) {
    const chunk = mails.slice(i, i + 100).map((m) => ({ from: FROM, to: m.to, subject: m.subject, html: m.html, text: m.text }))
    const { error } = await r.batch.send(chunk)
    if (error) failed += chunk.length
    else sent += chunk.length
  }
  return { sent, failed }
}

/* ---------- Brend şablonu ---------- */

export function layout(opts: { title: string; body: string; footer: string; locale?: string }) {
  return `<!doctype html><html lang="${opts.locale ?? 'az'}"><body style="margin:0;background:#F6F7FB;font-family:Inter,Arial,sans-serif;color:#0D0D0D">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F6F7FB;padding:24px 12px">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:16px;overflow:hidden">
<tr><td style="background:#0424D9;padding:20px 28px">
  <table role="presentation" cellpadding="0" cellspacing="0"><tr>
    <td style="font-family:Georgia,serif;font-weight:900;font-size:18px;line-height:1.1;color:#F2E74B">Good Morning<br>Baku</td>
  </tr></table>
</td></tr>
<tr><td style="padding:28px">
  <h1 style="font-family:Georgia,serif;font-size:26px;line-height:1.2;color:#03178C;margin:0 0 16px">${opts.title}</h1>
  ${opts.body}
</td></tr>
<tr><td style="background:#EEF1FB;padding:16px 28px;font-size:12px;line-height:1.5;color:#5B6280">${opts.footer}</td></tr>
</table>
</td></tr></table></body></html>`
}

export function button(label: string, url: string) {
  return `<a href="${url}" style="display:inline-block;background:#0424D9;color:#fff;text-decoration:none;font-weight:600;font-size:13px;letter-spacing:.06em;text-transform:uppercase;padding:14px 24px;border-radius:8px">${label}</a>`
}
