import type { MetadataRoute } from 'next'
import { locales, type AppPathnames } from '@/i18n/routing'
import { getPathname } from '@/i18n/navigation'
import { getAllArticleParams, getCategories } from '@/lib/data'
import { SITE_URL } from '@/lib/seo'

const staticPages: AppPathnames[] = ['/', '/bulleten', '/haqqimizda', '/elaqe', '/reklam', '/reklam/sorgu', '/media-kit', '/korporativ', '/mexfilik', '/istifade-sertleri']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const out: MetadataRoute.Sitemap = []
  const alt = (paths: Partial<Record<string, string>>) => ({ languages: Object.fromEntries(Object.entries(paths).map(([l, p]) => [l, SITE_URL + p])) })

  for (const href of staticPages) {
    const paths: Record<string, string> = {}
    for (const l of locales) paths[l] = getPathname({ href: href as '/', locale: l, forcePrefix: true })
    for (const l of locales) out.push({ url: SITE_URL + paths[l], changeFrequency: href === '/' ? 'hourly' : 'monthly', priority: href === '/' ? 1 : 0.5, alternates: alt(paths) })
  }

  for (const l of locales) {
    for (const c of await getCategories(l)) out.push({ url: `${SITE_URL}/${l}/${c.slug}`, changeFrequency: 'hourly', priority: 0.8 })
  }

  const params = await getAllArticleParams()
  for (const p of params) out.push({ url: `${SITE_URL}/${p.locale}/${p.category}/${p.slug}`, changeFrequency: 'daily', priority: 0.7 })
  return out
}
