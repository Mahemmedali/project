import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { locales, type Locale } from '@/i18n/routing'
import { getPathname } from '@/i18n/navigation'
import { getArticles, getAuthorBySlug, getAuthors } from '@/lib/data'
import { alternatesFromPaths, pageMetadata } from '@/lib/seo'
import { ArticleCard } from '@/components/article/ArticleCard'
import { Avatar } from '@/components/ui/Avatar'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { SetAlternates } from '@/components/layout/AlternatesContext'
import { IconLinkedin, IconXSocial } from '@/components/brand/Icons'

type Props = { params: Promise<{ locale: Locale; slug: string }> }

export async function generateStaticParams() {
  const out: { locale: Locale; slug: string }[] = []
  for (const locale of locales) for (const a of await getAuthors(locale)) out.push({ locale, slug: a.slug })
  return out
}

function paths(slug: string) {
  const out: Partial<Record<Locale, string>> = {}
  for (const l of locales) out[l] = getPathname({ href: { pathname: '/muellif/[slug]', params: { slug } }, locale: l, forcePrefix: true })
  return out
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const a = await getAuthorBySlug(locale, slug)
  if (!a) return {}
  return pageMetadata({ title: a.name, description: a.bio, locale, alternates: alternatesFromPaths(locale, paths(slug)) })
}

export default async function AuthorPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const a = await getAuthorBySlug(locale, slug)
  if (!a) notFound()
  const t = await getTranslations()
  const { items } = await getArticles({ locale, authorId: a.id, limit: 12 })

  return (
    <>
      <SetAlternates links={paths(slug)} />
      <section className="container-site pt-10 lg:pt-14">
        <div className="flex flex-col gap-6 rounded-card bg-brand-tint p-6 sm:flex-row sm:items-center sm:p-8">
          <Avatar name={a.name} initials={a.initials} src={a.photo} size={96} />
          <div className="min-w-0 flex-1">
            <p className="label-caps text-brand-blue">{a.role}</p>
            <h1 className="mt-1 text-h1">{a.name}</h1>
            <p className="mt-2 max-w-2xl text-body text-brand-muted">{a.bio}</p>
            {a.social && (
              <div className="mt-3 flex gap-2">
                {a.social.x && (
                  <a href={a.social.x} aria-label="X" className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand-navy hover:text-brand-blue">
                    <IconXSocial size={16} />
                  </a>
                )}
                {a.social.linkedin && (
                  <a href={a.social.linkedin} aria-label="LinkedIn" className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand-navy hover:text-brand-blue">
                    <IconLinkedin size={16} />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
      <section className="container-site mt-12">
        <SectionHeading title={t('author.articles')} />
        <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((x) => (
            <ArticleCard key={x.id} article={x} />
          ))}
        </div>
      </section>
    </>
  )
}
