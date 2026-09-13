import { locales, type Locale } from '@/i18n/routing'
import { getArticles } from '@/lib/data'
import { SITE_URL } from '@/lib/seo'

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]!)

export async function GET(_req: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale: l } = await params
  if (!(locales as readonly string[]).includes(l)) return new Response('Not found', { status: 404 })
  const locale = l as Locale
  const { items } = await getArticles({ locale, limit: 30 })
  const titles = { az: 'Good Morning Baku — Son xəbərlər', en: 'Good Morning Baku — Latest news', ru: 'Good Morning Baku — Последние новости' }
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${esc(titles[locale])}</title>
<link>${SITE_URL}/${locale}</link>
<atom:link href="${SITE_URL}/${locale}/rss.xml" rel="self" type="application/rss+xml"/>
<language>${locale}</language>
<description>${esc(titles[locale])}</description>
${items
  .map(
    (a) => `<item>
<title>${esc(a.title)}</title>
<link>${SITE_URL}/${locale}/${a.category.slug}/${a.slug}</link>
<guid isPermaLink="true">${SITE_URL}/${locale}/${a.category.slug}/${a.slug}</guid>
<pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate>
<category>${esc(a.category.name)}</category>
<description>${esc(a.excerpt)}</description>
</item>`,
  )
  .join('\n')}
</channel>
</rss>`
  return new Response(xml, { headers: { 'content-type': 'application/rss+xml; charset=utf-8', 'cache-control': 's-maxage=600, stale-while-revalidate' } })
}
