import { getLocale, getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { getMostRead } from '@/lib/data'
import { ArticleCard } from '@/components/article/ArticleCard'
import { AdSlot } from '@/components/ads/AdSlot'
import { NewsletterForm } from '@/components/forms/NewsletterForm'
import { SunriseArcs } from '@/components/brand/SunriseArcs'
import { IconTrending } from '@/components/brand/Icons'

/** Sağ sütun: ən çox oxunan + reklam + bülleten kartı */
export async function Sidebar({ excludeId, showAd = true }: { excludeId?: string; showAd?: boolean }) {
  const locale = (await getLocale()) as Locale
  const t = await getTranslations()
  const mostRead = (await getMostRead(locale, 6)).filter((a) => a.id !== excludeId).slice(0, 5)

  return (
    <aside className="space-y-8 lg:sticky lg:top-[132px]">
      <section className="rounded-card border border-brand-line p-5">
        <h2 className="mb-4 flex items-center gap-2 text-h3">
          <IconTrending size={20} className="text-brand-blue" />
          {t('home.mostRead')}
        </h2>
        <ol className="space-y-4">
          {mostRead.map((a, i) => (
            <li key={a.id} className="border-t border-brand-line pt-4 first:border-0 first:pt-0">
              <ArticleCard article={a} variant="numbered" index={i + 1} />
            </li>
          ))}
        </ol>
      </section>

      {showAd && <AdSlot slot="sidebar" />}

      <section className="relative overflow-hidden rounded-card bg-brand-blue p-5 text-white">
        <SunriseArcs className="h-[120%]" />
        <div className="relative">
          <p className="label-caps text-brand-yellow">{t('newsletter.frequency')}</p>
          <h2 className="mt-2 text-h3 text-white">{t('newsletter.title')}</h2>
          <p className="mt-1.5 text-[14px] text-brand-sky">{t('home.digestIntro')}</p>
          <NewsletterForm tone="dark" className="mt-4" />
        </div>
      </section>
    </aside>
  )
}
