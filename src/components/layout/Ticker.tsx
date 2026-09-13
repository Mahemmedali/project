import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { getBreaking, getSiteSettings } from '@/lib/data'
import { formatTime } from '@/lib/format'

/** Təcili xəbər zolağı — dərin göy fon, sarı etiket. Xəbər yoxdursa render edilmir. */
export async function Ticker() {
  const locale = (await getLocale()) as Locale
  const t = await getTranslations('ticker')
  const [items, settings] = await Promise.all([getBreaking(locale), getSiteSettings(locale)])
  if (!settings.tickerEnabled || !items.length) return null

  const row = items.map((a) => (
    <Link
      key={a.id}
      href={{ pathname: '/[category]/[slug]', params: { category: a.category.slug, slug: a.slug } }}
      className="inline-flex items-center gap-3 pr-12 text-[14px] text-white hover:text-brand-yellow"
    >
      <span className="font-mono text-caption text-brand-sky">{formatTime(a.publishedAt, locale)}</span>
      <span className="font-medium">{a.title}</span>
    </Link>
  ))

  return (
    <div className="bg-brand-navy" role="region" aria-label={t('label')}>
      <div className="container-site flex h-10 items-center gap-4 overflow-hidden">
        <span className="label-caps inline-flex h-6 shrink-0 items-center gap-1.5 rounded-[4px] bg-brand-gold px-2 text-brand-ink">
          <span aria-hidden className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-ink" />
          {t('label')}
        </span>
        <div className="relative flex-1 overflow-hidden">
          <div className="flex w-max animate-ticker whitespace-nowrap motion-reduce:animate-none">
            <span className="flex">{row}</span>
            <span className="flex" aria-hidden inert>
              {row}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
