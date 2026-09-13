import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { locales, type Locale } from '@/i18n/routing'

/** CMS "Önizləmə" / Live Preview: qaralamanı saytda göstər */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  if (searchParams.get('secret') !== process.env.PREVIEW_SECRET) return new Response('Forbidden', { status: 403 })
  const id = searchParams.get('id')
  const loc = searchParams.get('locale') ?? 'az'
  const locale: Locale = (locales as readonly string[]).includes(loc) ? (loc as Locale) : 'az'
  if (!id) return new Response('Missing id', { status: 400 })

  const payload = await getPayload({ config })
  const doc = await payload.findByID({ collection: 'articles', id, locale, fallbackLocale: false, draft: true, depth: 1, overrideAccess: true })
  const cat = doc && typeof doc.category === 'object' ? doc.category : null
  if (!doc?.slug || !cat?.slug) return new Response('Bu dildə slug yoxdur', { status: 404 })

  const dm = await draftMode()
  dm.enable()
  redirect(`/${locale}/${cat.slug}/${doc.slug}`)
}
