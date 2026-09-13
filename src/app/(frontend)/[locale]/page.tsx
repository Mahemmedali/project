import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { getArticles, getCategories, getEditorsPicks } from '@/lib/data'
import { alternatesFor, pageMetadata } from '@/lib/seo'
import { ArticleCard } from '@/components/article/ArticleCard'
import { AdSlot } from '@/components/ads/AdSlot'
import { Sidebar } from '@/components/layout/Sidebar'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { SunriseArcs } from '@/components/brand/SunriseArcs'
import { IconArrowRight, IconBriefcase } from '@/components/brand/Icons'
import { buttonClasses } from '@/components/ui/Button'
import { formatTime } from '@/lib/format'

export const revalidate = 300

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'site' })
  return {
    ...pageMetadata({ title: `${t('name')} — ${t('tagline')}`, description: t('description'), locale, alternates: alternatesFor(locale, '/') }),
    title: { absolute: `${t('name')} — ${t('tagline')}` },
  }
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations()

  const [{ items: latest }, categories, picks] = await Promise.all([
    getArticles({ locale, limit: 12 }),
    getCategories(locale),
    getEditorsPicks(locale),
  ])
  const hero = latest[0]
  const digest = latest.slice(1, 6)
  const feed = latest.slice(1, 7)

  return (
    <>
      {/* Hero: manşet + səhər xülasəsi */}
      <section className="container-site pt-6 lg:pt-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {hero && <ArticleCard article={hero} variant="hero" priority className="lg:col-span-2" />}
          <div className="relative flex flex-col overflow-hidden rounded-card bg-brand-navy p-6 text-white">
            <SunriseArcs className="h-[70%]" />
            <div className="relative flex-1">
              <p className="label-caps text-brand-yellow">{t('site.greeting')}</p>
              <h2 className="mt-1.5 text-h2 text-white">{t('home.digestTitle')}</h2>
              <p className="mt-1 text-[14px] text-brand-sky">{t('home.digestIntro')}</p>
              <ol className="mt-5 space-y-3.5">
                {digest.map((a, i) => (
                  <li key={a.id} className="flex gap-3 border-t border-white/15 pt-3.5">
                    <span className="font-heading text-[18px] leading-tight font-black text-brand-yellow">{i + 1}</span>
                    <Link
                      href={{ pathname: '/[category]/[slug]', params: { category: a.category.slug, slug: a.slug } }}
                      className="group block"
                    >
                      <span className="block text-[15px] leading-snug font-medium text-white group-hover:text-brand-yellow">{a.title}</span>
                      <span className="mt-0.5 block text-caption text-brand-sky">
                        {a.category.name} · {formatTime(a.publishedAt, locale)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
            <Link href="/bulleten" className={buttonClasses('yellow', 'md', 'relative mt-6 w-full')}>
              {t('home.digestCta')}
              <IconArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <div className="container-site mt-8">
        <AdSlot slot="home_top" />
      </div>

      {/* Son xəbərlər + sidebar */}
      <section className="container-site mt-10 lg:mt-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div>
            <SectionHeading title={t('home.latestTitle')} />
            <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {feed.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
            <div className="mt-10">
              <AdSlot slot="home_inline" />
            </div>
          </div>
          <Sidebar />
        </div>
      </section>

      {/* Redaksiyanın seçimi — mavi zolaq */}
      {picks.length > 0 && (
        <section className="relative mt-14 overflow-hidden bg-brand-blue py-12 text-white lg:mt-20 lg:py-16">
          <SunriseArcs className="h-[130%]" />
          <div className="container-site relative">
            <SectionHeading title={t('home.editorsPick')} tone="white" />
            <div className="grid gap-6 md:grid-cols-3">
              {picks.map((a) => (
                <Link
                  key={a.id}
                  href={{ pathname: '/[category]/[slug]', params: { category: a.category.slug, slug: a.slug } }}
                  className="group rounded-card bg-white/10 p-5 backdrop-blur-sm transition-colors hover:bg-white/15"
                >
                  <span className="label-caps text-brand-yellow">{a.category.name}</span>
                  <h3 className="mt-2 font-heading text-[20px] leading-snug font-bold text-white">{a.title}</h3>
                  <p className="mt-2 line-clamp-2 text-[14px] text-brand-sky">{a.excerpt}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-caption font-semibold text-white group-hover:text-brand-yellow">
                    {t('common.readMore')} <IconArrowRight size={14} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bölmə lentləri */}
      <section className="container-site mt-14 space-y-14 lg:mt-20">
        {(
          await Promise.all(
            categories.map(async (c) => ({ c, items: (await getArticles({ locale, categoryId: c.id, limit: 4 })).items })),
          )
        )
          .filter(({ items }) => items.length > 0)
          .map(({ c, items }) => (
            <div key={c.id}>
              <SectionHeading
                title={c.name}
                action={
                  <Link
                    href={{ pathname: '/[category]', params: { category: c.slug } }}
                    className="label-caps inline-flex items-center gap-1.5 text-brand-blue hover:text-brand-navy"
                  >
                    {t('home.viewAll')} <IconArrowRight size={16} />
                  </Link>
                }
              />
              <div className="grid gap-8 lg:grid-cols-2">
                <ArticleCard article={items[0]} variant="featured" />
                <div className="divide-y divide-brand-line">
                  {items.slice(1).map((a) => (
                    <ArticleCard key={a.id} article={a} variant="horizontal" className="py-4 first:pt-0 last:pb-0" />
                  ))}
                </div>
              </div>
            </div>
          ))}
      </section>

      {/* B2B teaser */}
      <section className="container-site mt-16 lg:mt-20">
        <div className="relative flex flex-col gap-6 overflow-hidden rounded-card bg-brand-navy p-8 text-white lg:flex-row lg:items-center lg:justify-between lg:p-12">
          <SunriseArcs className="h-[180%]" />
          <div className="relative max-w-2xl">
            <p className="label-caps flex items-center gap-2 text-brand-yellow">
              <IconBriefcase size={16} /> {t('b2b.eyebrow')}
            </p>
            <h2 className="mt-2 text-h2 text-white lg:text-h1">{t('b2b.title')}</h2>
            <p className="mt-3 text-body text-brand-sky">{t('b2b.formatsSubtitle')}</p>
          </div>
          <div className="relative flex shrink-0 flex-wrap gap-3">
            <Link href="/reklam" className={buttonClasses('yellow', 'lg')}>
              {t('nav.advertise')}
            </Link>
            <Link href="/media-kit" className={buttonClasses('outlineWhite', 'lg')}>
              {t('nav.mediaKit')}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
