import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import type { ArticleView } from '@/lib/types'
import { formatDate, formatTime } from '@/lib/format'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

/** Kateqoriya · vaxt · oxu müddəti  +  Reklam / Premium / Təcili etiketləri */
export function ArticleMeta({
  article,
  tone = 'light',
  showDate = false,
  linkCategory = false,
  className,
}: {
  article: ArticleView
  tone?: 'light' | 'dark'
  showDate?: boolean
  /** Kart daxilində (özü link olan) false — <a> içində <a> olmaz */
  linkCategory?: boolean
  className?: string
}) {
  const locale = useLocale() as Locale
  const t = useTranslations('article')
  const muted = tone === 'dark' ? 'text-brand-sky' : 'text-brand-faint'
  return (
    <div className={cn('flex flex-wrap items-center gap-x-2 gap-y-1.5 text-caption', muted, className)}>
      {article.isSponsored ? (
        <Badge variant="sponsored">{t('sponsored')}</Badge>
      ) : linkCategory ? (
        <Link
          href={{ pathname: '/[category]', params: { category: article.category.slug } }}
          className="label-caps -my-1 inline-flex min-h-6 items-center py-1 text-brand-blue hover:text-brand-navy"
          style={tone === 'dark' ? { color: 'var(--color-brand-yellow)' } : undefined}
        >
          {article.category.name}
        </Link>
      ) : (
        <span className="label-caps text-brand-blue" style={tone === 'dark' ? { color: 'var(--color-brand-yellow)' } : undefined}>
          {article.category.name}
        </span>
      )}
      {article.isBreaking && <Badge variant="breaking">{t('breaking')}</Badge>}
      {article.isPremium && <Badge variant="premium">{t('premium')}</Badge>}
      <span aria-hidden>·</span>
      <time dateTime={article.publishedAt}>
        {showDate ? formatDate(article.publishedAt, locale) : formatTime(article.publishedAt, locale)}
      </time>
      <span aria-hidden>·</span>
      <span>{t('readTime', { minutes: article.readingTime })}</span>
    </div>
  )
}
