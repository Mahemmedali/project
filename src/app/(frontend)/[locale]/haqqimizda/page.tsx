import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { getAuthors } from '@/lib/data'
import { alternatesFor, pageMetadata } from '@/lib/seo'
import { PageHero } from '@/components/layout/PageHero'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Avatar } from '@/components/ui/Avatar'
import { IconBolt, IconCheck, IconSparkle, IconUsers } from '@/components/brand/Icons'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'pages.about' })
  return pageMetadata({ title: t('title'), description: t('lead'), locale, alternates: alternatesFor(locale, '/haqqimizda') })
}

const valueIcons = { trust: IconCheck, speed: IconBolt, close: IconUsers, energy: IconSparkle }

export default async function AboutPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('pages.about')
  const authors = await getAuthors(locale)

  return (
    <>
      <PageHero tone="navy" eyebrow="Good Morning Baku" title={t('title')} lead={t('lead')} />
      <section className="container-site mt-14 grid gap-10 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <p className="label-caps text-brand-blue">{t('missionTitle')}</p>
          <p className="mt-3 font-heading text-[24px] leading-snug font-bold text-brand-navy">{t('mission')}</p>
        </div>
        <div>
          <p className="label-caps mb-4 text-brand-blue">{t('valuesTitle')}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {(['trust', 'speed', 'close', 'energy'] as const).map((k) => {
              const Icon = valueIcons[k]
              return (
                <div key={k} className="rounded-card bg-brand-tint p-5">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-blue text-white">
                    <Icon size={20} />
                  </span>
                  <h3 className="mt-3 text-h3">{t(`values.${k}.title`)}</h3>
                  <p className="mt-1 text-[15px] text-brand-muted">{t(`values.${k}.text`)}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>
      <section className="container-site mt-16">
        <SectionHeading title={t('teamTitle')} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {authors.map((a) => (
            <Link key={a.id} href={{ pathname: '/muellif/[slug]', params: { slug: a.slug } }} className="group rounded-card border border-brand-line p-5 transition-shadow hover:shadow-card">
              <Avatar name={a.name} initials={a.initials} src={a.photo} size={64} />
              <p className="mt-4 text-h3 group-hover:text-brand-blue">{a.name}</p>
              <p className="text-caption text-brand-faint">{a.role}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
