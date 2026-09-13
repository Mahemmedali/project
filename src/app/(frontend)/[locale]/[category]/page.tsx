import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { locales, type Locale } from '@/i18n/routing'
import { getArticles, getCategories, getCategoryAlternates, getCategoryBySlug } from '@/lib/data'
import { alternatesFromPaths, pageMetadata } from '@/lib/seo'
import { ArticleCard } from '@/components/article/ArticleCard'
import { AdSlot } from '@/components/ads/AdSlot'
import { Sidebar } from '@/components/layout/Sidebar'
import { SetAlternates } from '@/components/layout/AlternatesContext'
import { Button } from '@/components/ui/Button'

export const revalidate = 300

type Props = { params: Promise<{ locale: Locale; category: string }> }

export async function generateStaticParams() {
  const out: { locale: Locale; category: string }[] = []
  for (const locale of locales) for (const c of await getCategories(locale)) out.push({ locale, category: c.slug })
  return out
}

async function paths(id: string) {
  const alt = await getCategoryAlternates(id)
  const out: Partial<Record<Locale, string>> = {}
  if (alt) for (const l of locales) out[l] = `/${l}/${alt[l]}`
  return out
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, category } = await params
  const c = await getCategoryBySlug(locale, category)
  if (!c) return {}
  return pageMetadata({ title: c.name, description: c.description, locale, alternates: alternatesFromPaths(locale, await paths(c.id)) })
}

export default async function CategoryPage({ params }: Props) {
  const { locale, category } = await params
  setRequestLocale(locale)
  const c = await getCategoryBySlug(locale, category)
  if (!c) notFound()
  const t = await getTranslations()
  const { items, total } = await getArticles({ locale, categoryId: c.id, limit: 13 })
  const [first, ...rest] = items

  return (
    <>
      <SetAlternates links={await paths(c.id)} />
      <section className="container-site pt-10 lg:pt-14">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-brand-line pb-6">
          <div className="max-w-2xl">
            <h1 className="text-[34px] leading-tight sm:text-h1 lg:text-[52px] lg:leading-[1.1]">{c.name}</h1>
            <p className="mt-3 text-lead text-brand-muted">{c.description}</p>
          </div>
          <p className="label-caps text-brand-faint">{t('category.articlesCount', { count: total })}</p>
        </div>
      </section>

      <div className="container-site mt-8">
        <AdSlot slot="category_top" />
      </div>

      <section className="container-site mt-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div>
            {first ? (
              <>
                <ArticleCard article={first} variant="featured" priority className="mb-10" />
                <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((a) => (
                    <ArticleCard key={a.id} article={a} />
                  ))}
                </div>
                {total > items.length && (
                  <div className="mt-10 text-center">
                    <Button variant="secondary" size="lg">
                      {t('category.loadMore')}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <p className="rounded-card bg-brand-surface p-8 text-center text-brand-muted">{t('category.empty')}</p>
            )}
          </div>
          <Sidebar />
        </div>
      </section>
    </>
  )
}
