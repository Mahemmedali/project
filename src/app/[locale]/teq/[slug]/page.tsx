import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { locales, type Locale } from '@/i18n/routing'
import { getPathname } from '@/i18n/navigation'
import { getArticles, getTagAlternates, getTagBySlug } from '@/lib/data'
import { alternatesFromPaths, pageMetadata } from '@/lib/seo'
import { ArticleCard } from '@/components/article/ArticleCard'
import { SetAlternates } from '@/components/layout/AlternatesContext'
import { Sidebar } from '@/components/layout/Sidebar'

type Props = { params: Promise<{ locale: Locale; slug: string }> }

async function paths(id: string) {
  const alt = await getTagAlternates(id)
  const out: Partial<Record<Locale, string>> = {}
  if (alt) for (const l of locales) out[l] = getPathname({ href: { pathname: '/teq/[slug]', params: { slug: alt[l] } }, locale: l, forcePrefix: true })
  return out
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const tag = await getTagBySlug(locale, slug)
  if (!tag) return {}
  const t = await getTranslations({ locale, namespace: 'tag' })
  return pageMetadata({ title: t('title', { tag: tag.name }), locale, alternates: alternatesFromPaths(locale, await paths(tag.id)) })
}

export default async function TagPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const tag = await getTagBySlug(locale, slug)
  if (!tag) notFound()
  const t = await getTranslations()
  const { items, total } = await getArticles({ locale, tagId: tag.id, limit: 12 })

  return (
    <>
      <SetAlternates links={await paths(tag.id)} />
      <section className="container-site pt-10 lg:pt-14">
        <div className="border-b border-brand-line pb-6">
          <p className="label-caps text-brand-blue">{t('article.tags')}</p>
          <h1 className="mt-1 text-h1">#{tag.name}</h1>
          <p className="mt-2 text-caption text-brand-faint">{t('category.articlesCount', { count: total })}</p>
        </div>
      </section>
      <section className="container-site mt-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2">
            {items.map((x) => (
              <ArticleCard key={x.id} article={x} />
            ))}
          </div>
          <Sidebar />
        </div>
      </section>
    </>
  )
}
