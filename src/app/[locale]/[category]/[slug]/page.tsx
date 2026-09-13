import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { locales, type Locale } from '@/i18n/routing'
import { getAllArticleParams, getArticleBySlug, getRelated } from '@/lib/data'
import { alternatesFromPaths, pageMetadata, SITE_URL } from '@/lib/seo'
import { formatDateTime } from '@/lib/format'
import { ArticleCard } from '@/components/article/ArticleCard'
import { ArticleMeta } from '@/components/article/ArticleMeta'
import { AuthorByline } from '@/components/article/AuthorByline'
import { CoverImage } from '@/components/article/CoverImage'
import { RichText } from '@/components/article/RichText'
import { SponsoredLabel } from '@/components/article/SponsoredLabel'
import { Paywall } from '@/components/article/Paywall'
import { ShareButtons } from '@/components/article/ShareButtons'
import { AdSlot } from '@/components/ads/AdSlot'
import { Sidebar } from '@/components/layout/Sidebar'
import { SetAlternates } from '@/components/layout/AlternatesContext'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Chip } from '@/components/ui/Chip'
import { Avatar } from '@/components/ui/Avatar'
import { IconArrowRight } from '@/components/brand/Icons'

type Props = { params: Promise<{ locale: Locale; category: string; slug: string }> }

export async function generateStaticParams() {
  return getAllArticleParams()
}

function altPaths(alts: Partial<Record<Locale, { category: string; slug: string }>>) {
  const out: Partial<Record<Locale, string>> = {}
  for (const l of locales) if (alts[l]) out[l] = `/${l}/${alts[l]!.category}/${alts[l]!.slug}`
  return out
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, category, slug } = await params
  const a = await getArticleBySlug(locale, category, slug)
  if (!a) return {}
  return pageMetadata({
    title: a.title,
    description: a.excerpt,
    locale,
    alternates: alternatesFromPaths(locale, altPaths(a.alternates)),
    image: SITE_URL + a.cover.src,
    type: 'article',
    publishedTime: a.publishedAt,
    authors: a.authors.map((x) => x.name),
  })
}

export default async function ArticlePage({ params }: Props) {
  const { locale, category, slug } = await params
  setRequestLocale(locale)
  const a = await getArticleBySlug(locale, category, slug)
  if (!a) notFound()
  const t = await getTranslations()
  const related = await getRelated(locale, a, 3)
  const body = a.isPremium ? a.body.slice(0, 1) : a.body
  // Reklamı iki paraqraf arasına qoy (siyahı/sitat/başlığı bölməsin)
  let mid = Math.ceil(body.length / 2)
  while (mid > 1 && mid < body.length && !(body[mid - 1].type === 'paragraph' && body[mid].type === 'paragraph')) mid++
  if (mid >= body.length) mid = body.length

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: a.title,
    description: a.excerpt,
    image: [SITE_URL + a.cover.src],
    datePublished: a.publishedAt,
    dateModified: a.updatedAt ?? a.publishedAt,
    author: a.authors.map((x) => ({ '@type': 'Person', name: x.name })),
    publisher: { '@type': 'Organization', name: 'Good Morning Baku', logo: { '@type': 'ImageObject', url: SITE_URL + '/brand/gmb-logo.png' } },
    isAccessibleForFree: !a.isPremium,
  }

  return (
    <>
      <SetAlternates links={altPaths(a.alternates)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article className="container-site pt-8 lg:pt-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="min-w-0">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-caption text-brand-faint">
              <Link href="/" className="hover:text-brand-blue">{t('nav.home')}</Link>
              <span aria-hidden>/</span>
              <Link href={{ pathname: '/[category]', params: { category: a.category.slug } }} className="hover:text-brand-blue">
                {a.category.name}
              </Link>
            </nav>

            <header className="max-w-3xl">
              <ArticleMeta article={a} showDate />
              <h1 className="mt-3 text-[30px] leading-[1.15] sm:text-h1 lg:text-[46px] lg:leading-[1.12]">{a.title}</h1>
              <p className="mt-4 font-medium text-lead text-brand-muted">{a.excerpt}</p>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-brand-line py-4">
                <AuthorByline authors={a.authors} />
                <ShareButtons title={a.title} />
              </div>
            </header>

            <figure className="mt-6">
              <CoverImage src={a.cover.src} alt={a.cover.alt} priority sizes="(max-width: 1024px) 100vw, 800px" className="aspect-[16/9]" />
              {a.cover.credit && (
                <figcaption className="mt-2 text-caption text-brand-faint">
                  {t('article.photo')}: {a.cover.credit}
                </figcaption>
              )}
            </figure>

            {a.isSponsored && (
              <div className="mt-6 max-w-3xl">
                <SponsoredLabel partner={a.sponsor} />
              </div>
            )}

            <div className="mt-8 max-w-3xl">
              <RichText blocks={body.slice(0, mid)} />
              {!a.isPremium && body.length > 2 && (
                <div className="my-8">
                  <AdSlot slot="article_inline" />
                </div>
              )}
              <RichText blocks={body.slice(mid)} />
              {a.isPremium && <Paywall />}
            </div>

            <footer className="mt-10 max-w-3xl space-y-8">
              {a.tags.length > 0 && (
                <div>
                  <p className="label-caps mb-3 text-brand-faint">{t('article.tags')}</p>
                  <div className="flex flex-wrap gap-2">
                    {a.tags.map((tag) => (
                      <Link key={tag.id} href={{ pathname: '/teq/[slug]', params: { slug: tag.slug } }}>
                        <Chip>{tag.name}</Chip>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              <p className="text-caption text-brand-faint">
                {t('article.published')}: {formatDateTime(a.publishedAt, locale)}
                {a.updatedAt && ` · ${t('article.updated')}: ${formatDateTime(a.updatedAt, locale)}`}
              </p>

              {/* Müəllif kartı */}
              {a.authors.map((au) => (
                <div key={au.id} className="flex gap-4 rounded-card bg-brand-tint p-5">
                  <Avatar name={au.name} initials={au.initials} src={au.photo} size={56} />
                  <div>
                    <Link href={{ pathname: '/muellif/[slug]', params: { slug: au.slug } }} className="text-h3 hover:text-brand-blue">
                      {au.name}
                    </Link>
                    <p className="text-caption text-brand-faint">{au.role}</p>
                    <p className="mt-2 text-[15px] text-brand-muted">{au.bio}</p>
                  </div>
                </div>
              ))}
              <ShareButtons title={a.title} />
            </footer>
          </div>
          <Sidebar excludeId={a.id} />
        </div>
      </article>

      <div className="container-site mt-12">
        <AdSlot slot="article_bottom" />
      </div>

      {related.length > 0 && (
        <section className="container-site mt-14">
          <SectionHeading
            title={t('article.related')}
            action={
              <Link
                href={{ pathname: '/[category]', params: { category: a.category.slug } }}
                className="label-caps inline-flex items-center gap-1.5 text-brand-blue hover:text-brand-navy"
              >
                {t('home.allIn', { category: a.category.name })} <IconArrowRight size={16} />
              </Link>
            }
          />
          <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <ArticleCard key={r.id} article={r} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}
