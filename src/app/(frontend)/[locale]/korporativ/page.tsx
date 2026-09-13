import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { alternatesFor, pageMetadata } from '@/lib/seo'
import { PageHero } from '@/components/layout/PageHero'
import { buttonClasses } from '@/components/ui/Button'
import { IconMail, IconNewspaper, IconTrending } from '@/components/brand/Icons'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'b2b.corporate' })
  return pageMetadata({ title: t('title'), description: t('subtitle'), locale, alternates: alternatesFor(locale, '/korporativ') })
}

const icons = { one: IconMail, two: IconNewspaper, three: IconTrending }

export default async function CorporatePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('b2b')

  return (
    <>
      <PageHero tone="navy" eyebrow={t('eyebrow')} title={t('corporate.title')} lead={t('corporate.subtitle')}>
        <Link href={{ pathname: '/reklam/sorgu', query: { service: 'corporate' } }} className={buttonClasses('yellow', 'lg')}>
          {t('cta')}
        </Link>
      </PageHero>
      <section className="container-site mt-14 grid gap-6 md:grid-cols-3">
        {(['one', 'two', 'three'] as const).map((k) => {
          const Icon = icons[k]
          return (
            <div key={k} className="rounded-card bg-brand-tint p-6">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-brand-blue text-white">
                <Icon size={22} />
              </span>
              <h3 className="mt-4 text-h3">{t(`corporate.items.${k}.title`)}</h3>
              <p className="mt-1.5 text-[15px] text-brand-muted">{t(`corporate.items.${k}.text`)}</p>
            </div>
          )
        })}
      </section>
    </>
  )
}
