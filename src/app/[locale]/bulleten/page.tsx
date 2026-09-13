import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { getArticles } from '@/lib/data'
import { alternatesFor, pageMetadata } from '@/lib/seo'
import { formatDate, formatTime } from '@/lib/format'
import { NewsletterForm } from '@/components/forms/NewsletterForm'
import { LogoMark } from '@/components/brand/Logo'
import { SunriseArcs } from '@/components/brand/SunriseArcs'
import { IconCheck } from '@/components/brand/Icons'
import { SectionHeading } from '@/components/ui/SectionHeading'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'newsletter' })
  return pageMetadata({ title: t('title'), description: t('subtitle'), locale, alternates: alternatesFor(locale, '/bulleten') })
}

export default async function NewsletterPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations()
  const { items } = await getArticles({ locale, limit: 5 })

  return (
    <>
      <section className="relative overflow-hidden bg-brand-blue text-white">
        <SunriseArcs className="h-[150%]" />
        <div className="container-site relative grid gap-10 py-14 lg:grid-cols-2 lg:items-center lg:py-20">
          <div>
            <p className="label-caps text-brand-yellow">
              {t('newsletter.frequency')} · {t('newsletter.free')}
            </p>
            <h1 className="mt-3 text-[34px] leading-[1.15] text-white sm:text-h1 lg:text-[52px] lg:leading-[1.1]">{t('newsletter.title')}</h1>
            <p className="mt-4 max-w-lg text-lead text-brand-sky">{t('newsletter.subtitle')}</p>
            <ul className="mt-6 space-y-2.5">
              {(['one', 'two', 'three'] as const).map((k) => (
                <li key={k} className="flex items-center gap-3 text-body">
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-yellow text-brand-navy">
                    <IconCheck size={14} />
                  </span>
                  {t(`newsletter.benefits.${k}`)}
                </li>
              ))}
            </ul>
            <NewsletterForm tone="dark" compact className="mt-8 max-w-lg" />
          </div>

          {/* E-poçt önizləməsi */}
          <div className="mx-auto w-full max-w-md rounded-card bg-white p-6 text-brand-ink shadow-float">
            <div className="flex items-center gap-3 border-b border-brand-line pb-4">
              <LogoMark size={40} />
              <div>
                <p className="font-heading text-[15px] font-bold text-brand-navy">{t('site.greeting')}</p>
                <p className="text-caption text-brand-faint">
                  {formatDate(items[0]?.publishedAt ?? new Date().toISOString(), locale)} · 07:30
                </p>
              </div>
            </div>
            <ol className="mt-4 space-y-3">
              {items.map((a, i) => (
                <li key={a.id} className="flex gap-3">
                  <span className="font-heading text-[16px] font-black text-brand-blue">{i + 1}</span>
                  <div>
                    <p className="text-[14px] leading-snug font-semibold text-brand-navy">{a.title}</p>
                    <p className="text-caption text-brand-faint">
                      {a.category.name} · {formatTime(a.publishedAt, locale)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-5 rounded-btn bg-brand-tint p-3 text-center text-caption text-brand-muted">☀️ 27°C · {t('nav.weather')}</p>
          </div>
        </div>
      </section>

      <section className="container-site mt-14">
        <SectionHeading title={t('newsletter.archive')} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((d) => {
            const date = new Date(Date.now() - (d + 1) * 86400000).toISOString()
            return (
              <div key={d} className="rounded-card border border-brand-line p-5 transition-shadow hover:shadow-card">
                <p className="label-caps text-brand-blue">{formatDate(date, locale)}</p>
                <p className="mt-2 text-h3">{t('site.greeting')}</p>
                <p className="mt-1 line-clamp-2 text-[14px] text-brand-muted">{items[d]?.title}</p>
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
}
