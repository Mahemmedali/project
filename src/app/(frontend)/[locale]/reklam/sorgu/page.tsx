import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { alternatesFor, pageMetadata } from '@/lib/seo'
import { PageHero } from '@/components/layout/PageHero'
import { LeadForm } from '@/components/forms/LeadForm'
import { IconClock, IconMail, IconPhone } from '@/components/brand/Icons'

type Props = { params: Promise<{ locale: Locale }>; searchParams: Promise<{ service?: string }> }
const services = ['display', 'native', 'sponsored', 'newsletter', 'corporate', 'event'] as const

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'b2b.form' })
  return pageMetadata({ title: t('title'), description: t('subtitle'), locale, alternates: alternatesFor(locale, '/reklam/sorgu') })
}

export default async function LeadPage({ params, searchParams }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const { service } = await searchParams
  const t = await getTranslations('b2b')
  const def = services.find((s) => s === service)

  return (
    <>
      <PageHero eyebrow={t('eyebrow')} title={t('form.title')} lead={t('form.subtitle')} />
      <section className="container-site mt-6 grid gap-10 lg:grid-cols-[1fr_320px]">
        <div className="rounded-card border border-brand-line p-6 sm:p-8">
          <LeadForm defaultService={def} />
        </div>
        <aside className="space-y-4">
          <div className="rounded-card bg-brand-tint p-5">
            <p className="label-caps text-brand-blue">{t('process.one.title')}</p>
            <p className="mt-2 flex items-center gap-2 text-[15px] text-brand-navy">
              <IconClock size={18} className="text-brand-blue" /> {t('process.one.text')}
            </p>
          </div>
          <div className="rounded-card bg-brand-tint p-5 text-[15px]">
            <p className="flex items-center gap-2 text-brand-navy">
              <IconMail size={18} className="text-brand-blue" />
              <a href="mailto:reklam@goodmorningbaku.com" className="hover:text-brand-blue">reklam@goodmorningbaku.com</a>
            </p>
            <p className="mt-2 flex items-center gap-2 text-brand-navy">
              <IconPhone size={18} className="text-brand-blue" /> +994 XX XXX XX XX
            </p>
          </div>
        </aside>
      </section>
    </>
  )
}
