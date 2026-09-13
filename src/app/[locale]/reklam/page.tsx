import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { alternatesFor, pageMetadata } from '@/lib/seo'
import { formatCompact, formatNumber } from '@/lib/format'
import { PageHero } from '@/components/layout/PageHero'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { buttonClasses } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import {
  IconBriefcase,
  IconCalendar,
  IconLayout,
  IconMail,
  IconNewspaper,
  IconSmartphone,
  IconSparkle,
  IconUsers,
} from '@/components/brand/Icons'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'b2b' })
  return pageMetadata({ title: t('eyebrow'), description: t('subtitle'), locale, alternates: alternatesFor(locale, '/reklam') })
}

const formatIcons = { display: IconLayout, native: IconNewspaper, sponsored: IconSparkle, newsletter: IconMail, corporate: IconBriefcase, event: IconCalendar } as const

export default async function AdvertisePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('b2b')
  const ta = await getTranslations('article')

  const stats = [
    { Icon: IconUsers, value: formatCompact(250000, locale), label: t('stats.readers') },
    { Icon: IconSmartphone, value: formatNumber(0.78, locale, { style: 'percent' }), label: t('stats.mobile') },
    { Icon: IconSparkle, value: formatNumber(0.71, locale, { style: 'percent' }), label: t('stats.age') },
    { Icon: IconMail, value: formatCompact(12000, locale), label: t('stats.newsletter') },
  ]

  return (
    <>
      <PageHero tone="blue" eyebrow={t('eyebrow')} title={t('title')} lead={t('subtitle')}>
        <div className="flex flex-wrap gap-3">
          <Link href="/reklam/sorgu" className={buttonClasses('yellow', 'lg')}>
            {t('cta')}
          </Link>
          <Link href="/media-kit" className={buttonClasses('outlineWhite', 'lg')}>
            {t('ctaSecondary')}
          </Link>
        </div>
      </PageHero>

      {/* Auditoriya */}
      <section className="container-site mt-14">
        <SectionHeading title={t('statsTitle')} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ Icon, value, label }) => (
            <div key={label} className="rounded-card bg-brand-tint p-6">
              <Icon size={22} className="text-brand-blue" />
              <p className="mt-4 font-heading text-[40px] leading-none font-black text-brand-navy">{value}</p>
              <p className="mt-2 text-[14px] text-brand-muted">{label}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-caption text-brand-faint">{t('statsNote')}</p>
      </section>

      {/* Formatlar */}
      <section className="container-site mt-16">
        <SectionHeading title={t('formatsTitle')} />
        <p className="-mt-3 mb-6 text-body text-brand-muted">{t('formatsSubtitle')}</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(Object.keys(formatIcons) as (keyof typeof formatIcons)[]).map((k) => {
            const Icon = formatIcons[k]
            return (
              <Link
                key={k}
                href={{ pathname: '/reklam/sorgu', query: { service: k } }}
                className="group flex flex-col rounded-card border border-brand-line p-6 transition-shadow hover:shadow-card"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-brand-blue text-white">
                    <Icon size={22} />
                  </span>
                  <Badge variant="ad">{k === 'sponsored' ? ta('sponsored') : ta('ad')}</Badge>
                </div>
                <h3 className="mt-4 text-h3 group-hover:text-brand-blue">{t(`formats.${k}.name`)}</h3>
                <p className="mt-1.5 text-[15px] text-brand-muted">{t(`formats.${k}.desc`)}</p>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Proses */}
      <section className="container-site mt-16">
        <div className="rounded-card bg-brand-navy p-8 text-white lg:p-12">
          <SectionHeading title={t('processTitle')} tone="white" />
          <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {(['one', 'two', 'three', 'four'] as const).map((k, i) => (
              <li key={k} className="border-t border-white/15 pt-4">
                <span className="font-heading text-[32px] leading-none font-black text-brand-yellow">0{i + 1}</span>
                <h3 className="mt-3 text-h3 text-white">{t(`process.${k}.title`)}</h3>
                <p className="mt-1 text-[14px] text-brand-sky">{t(`process.${k}.text`)}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10">
            <Link href="/reklam/sorgu" className={buttonClasses('yellow', 'lg')}>
              {t('cta')}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
