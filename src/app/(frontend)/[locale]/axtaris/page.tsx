import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { getArticles, getPopularTags } from '@/lib/data'
import { alternatesFor, pageMetadata } from '@/lib/seo'
import { ArticleCard } from '@/components/article/ArticleCard'
import { SearchForm } from '@/components/layout/SearchForm'
import { Chip } from '@/components/ui/Chip'

type Props = { params: Promise<{ locale: Locale }>; searchParams: Promise<{ q?: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'search' })
  return { ...pageMetadata({ title: t('title'), locale, alternates: alternatesFor(locale, '/axtaris') }), robots: { index: false } }
}

export default async function SearchPage({ params, searchParams }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const { q = '' } = await searchParams
  const t = await getTranslations('search')
  const query = q.trim()
  const [{ items, total }, popular] = await Promise.all([
    query ? getArticles({ locale, q: query, limit: 24 }) : Promise.resolve({ items: [], total: 0 }),
    getPopularTags(locale),
  ])

  return (
    <section className="container-site pt-10 lg:pt-14">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-h1">{t('title')}</h1>
        <SearchForm defaultValue={query} size="lg" autoFocus className="mt-6" />
        {!query && (
          <div className="mt-8">
            <p className="text-body text-brand-muted">{t('hint')}</p>
            <p className="label-caps mt-6 mb-3 text-brand-faint">{t('popular')}</p>
            <div className="flex flex-wrap gap-2">
              {popular.map((tag) => (
                <Link key={tag.id} href={{ pathname: '/teq/[slug]', params: { slug: tag.slug } }}>
                  <Chip>#{tag.name}</Chip>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {query && (
        <div className="mt-10">
          <p className="mb-6 text-lead text-brand-muted" aria-live="polite">
            {total ? t('results', { query, count: total }) : t('noResults', { query })}
          </p>
          <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
