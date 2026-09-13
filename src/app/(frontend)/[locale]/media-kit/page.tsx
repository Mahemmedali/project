import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { alternatesFor, pageMetadata } from '@/lib/seo'
import { PageHero } from '@/components/layout/PageHero'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { buttonClasses } from '@/components/ui/Button'
import { LogoMark } from '@/components/brand/Logo'
import { SunriseArcs } from '@/components/brand/SunriseArcs'
import { IconDownload } from '@/components/brand/Icons'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'b2b.mediaKit' })
  return pageMetadata({ title: t('title'), description: t('subtitle'), locale, alternates: alternatesFor(locale, '/media-kit') })
}

const specs = [
  { format: 'Billboard', size: '970 × 250', placement: 'home_top / category_top', weight: '150 KB' },
  { format: 'Leaderboard', size: '728 × 90', placement: 'home_inline / article_inline', weight: '100 KB' },
  { format: 'Half page', size: '300 × 600', placement: 'sidebar', weight: '150 KB' },
  { format: 'Medium rectangle', size: '300 × 250', placement: 'sidebar (mobile)', weight: '100 KB' },
  { format: 'Mobile banner', size: '320 × 100', placement: 'home_top (mobile)', weight: '60 KB' },
  { format: 'Native card', size: '800 × 500 + 90 simvol', placement: 'feed', weight: '200 KB' },
]

export default async function MediaKitPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('b2b')

  return (
    <>
      <PageHero eyebrow={t('eyebrow')} title={t('mediaKit.title')} lead={t('mediaKit.subtitle')}>
        <div className="flex flex-wrap gap-3">
          <a href="/media-kit/GMB_Media_Kit_2026.pdf" className={buttonClasses('primary', 'lg')}>
            <IconDownload size={18} /> {t('mediaKit.download')}
          </a>
          <Link href="/reklam/sorgu" className={buttonClasses('secondary', 'lg')}>
            {t('cta')}
          </Link>
        </div>
      </PageHero>

      {/* Üz qabığı önizləməsi */}
      <section className="container-site mt-6 grid gap-8 lg:grid-cols-[360px_1fr] lg:items-start">
        <div className="relative aspect-[3/4] overflow-hidden rounded-card bg-brand-blue p-8 text-white shadow-float">
          <SunriseArcs className="h-[70%]" />
          <div className="relative flex h-full flex-col">
            <LogoMark size={72} />
            <div className="mt-auto">
              <p className="label-caps text-brand-yellow">{t('mediaKit.title').toUpperCase()}</p>
              <p className="mt-2 font-heading text-[28px] leading-tight font-bold text-white">{t('eyebrow')}</p>
              <p className="mt-1 text-[14px] text-brand-sky">goodmorningbaku.com</p>
            </div>
          </div>
        </div>

        <div>
          <SectionHeading title={t('mediaKit.specsTitle')} />
          <div className="overflow-x-auto rounded-card border border-brand-line">
            <table className="w-full min-w-[560px] text-left text-[15px]">
              <thead className="bg-brand-tint">
                <tr>
                  {(['format', 'size', 'placement', 'weight'] as const).map((k) => (
                    <th key={k} className="label-caps px-5 py-3 text-brand-navy">
                      {t(`mediaKit.columns.${k}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-line">
                {specs.map((s) => (
                  <tr key={s.format}>
                    <td className="px-5 py-3.5 font-semibold text-brand-navy">{s.format}</td>
                    <td className="px-5 py-3.5 font-mono text-[14px]">{s.size}</td>
                    <td className="px-5 py-3.5 font-mono text-[13px] text-brand-muted">{s.placement}</td>
                    <td className="px-5 py-3.5 text-brand-muted">{s.weight}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-caption text-brand-faint">{t('mediaKit.specsNote')}</p>
        </div>
      </section>
    </>
  )
}
