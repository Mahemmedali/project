import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { alternatesFor, pageMetadata } from '@/lib/seo'
import { PageHero } from '@/components/layout/PageHero'
import { SunriseArcs } from '@/components/brand/SunriseArcs'
import { IconBriefcase, IconMail, IconMapPin, IconNewspaper } from '@/components/brand/Icons'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'pages.contact' })
  return pageMetadata({ title: t('title'), description: t('lead'), locale, alternates: alternatesFor(locale, '/elaqe') })
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('pages.contact')

  const cards = [
    { Icon: IconNewspaper, title: t('editorial'), value: 'redaksiya@goodmorningbaku.com', href: 'mailto:redaksiya@goodmorningbaku.com' },
    { Icon: IconBriefcase, title: t('partnerships'), value: 'reklam@goodmorningbaku.com', href: 'mailto:reklam@goodmorningbaku.com' },
    { Icon: IconMapPin, title: t('address'), value: t('addressValue') },
  ]

  return (
    <>
      <PageHero title={t('title')} lead={t('lead')} />
      <section className="container-site mt-6 grid gap-6 lg:grid-cols-3">
        {cards.map(({ Icon, title, value, href }) => (
          <div key={title} className="rounded-card border border-brand-line p-6">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-brand-tint text-brand-blue">
              <Icon size={22} />
            </span>
            <p className="mt-4 label-caps text-brand-faint">{title}</p>
            {href ? (
              <a href={href} className="mt-1 block text-h3 text-brand-blue hover:text-brand-navy">{value}</a>
            ) : (
              <p className="mt-1 text-h3">{value}</p>
            )}
          </div>
        ))}
      </section>
      <section className="container-site mt-8">
        <div className="relative overflow-hidden rounded-card bg-brand-blue p-8 text-white lg:p-12">
          <SunriseArcs className="h-[170%]" />
          <div className="relative max-w-xl">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-brand-yellow text-brand-navy">
              <IconMail size={22} />
            </span>
            <h2 className="mt-4 text-h2 text-white">{t('tipTitle')}</h2>
            <p className="mt-2 text-body text-brand-sky">{t('tipText')}</p>
            <a href="mailto:redaksiya@goodmorningbaku.com" className="mt-5 inline-block font-heading text-[20px] font-bold text-brand-yellow underline-offset-4 hover:underline">
              redaksiya@goodmorningbaku.com
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
