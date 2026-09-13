import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import type { ArticleView } from '@/lib/types'
import { cn } from '@/lib/utils'
import { CoverImage } from './CoverImage'
import { ArticleMeta } from './ArticleMeta'
import { Badge } from '@/components/ui/Badge'

export type ArticleCardVariant = 'hero' | 'featured' | 'standard' | 'compact' | 'horizontal' | 'numbered'

function articleHref(a: ArticleView) {
  return { pathname: '/[category]/[slug]' as const, params: { category: a.category.slug, slug: a.slug } }
}

export function ArticleCard({
  article,
  variant = 'standard',
  index,
  priority,
  className,
}: {
  article: ArticleView
  variant?: ArticleCardVariant
  index?: number
  priority?: boolean
  className?: string
}) {
  const t = useTranslations('article')
  const href = articleHref(article)

  if (variant === 'hero') {
    // Manşet: dərin göy örtük foto üzərində (brend kitabı: 60–70% şəffaflıq)
    return (
      <article className={cn('group relative overflow-hidden rounded-card bg-brand-navy', className)}>
        <Link href={href} className="block">
          <CoverImage src={article.cover.src} alt={article.cover.alt} priority={priority} sizes="(max-width: 1024px) 100vw, 66vw" className="aspect-[16/10] rounded-none sm:aspect-[16/9]" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/70 to-brand-navy/5" />
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge variant="onBlue">{article.category.name}</Badge>
              {article.isBreaking && <Badge variant="breaking">{t('breaking')}</Badge>}
              {article.isSponsored && <Badge variant="sponsored">{t('sponsored')}</Badge>}
            </div>
            <h2 className="font-heading text-[26px] leading-[1.15] font-bold text-white sm:text-[36px] lg:text-h1">
              {article.title}
            </h2>
            <p className="mt-3 hidden max-w-2xl text-lead text-brand-sky sm:block">{article.excerpt}</p>
            <ArticleMeta article={article} tone="dark" className="mt-4 [&_a]:text-brand-yellow" />
          </div>
        </Link>
      </article>
    )
  }

  if (variant === 'featured') {
    return (
      <article className={cn('group', className)}>
        <Link href={href} className="block">
          <CoverImage src={article.cover.src} alt={article.cover.alt} priority={priority} className="aspect-[16/10]" />
          <div className="pt-4">
            <ArticleMeta article={article} />
            <h3 className="mt-2 font-heading text-[22px] leading-snug font-bold text-brand-navy group-hover:text-brand-blue sm:text-h2">
              {article.title}
            </h3>
            <p className="mt-2 line-clamp-3 text-body text-brand-muted">{article.excerpt}</p>
          </div>
        </Link>
      </article>
    )
  }

  if (variant === 'compact') {
    return (
      <article className={cn('group', className)}>
        <Link href={href} className="block">
          <ArticleMeta article={article} />
          <h3 className="mt-1.5 text-h3 group-hover:text-brand-blue">{article.title}</h3>
        </Link>
      </article>
    )
  }

  if (variant === 'horizontal') {
    return (
      <article className={cn('group', className)}>
        <Link href={href} className="flex gap-4">
          <CoverImage src={article.cover.src} alt={article.cover.alt} sizes="160px" className="aspect-[4/3] w-28 shrink-0 sm:w-40" />
          <div className="min-w-0">
            <ArticleMeta article={article} />
            <h3 className="mt-1.5 line-clamp-3 text-h3 group-hover:text-brand-blue">{article.title}</h3>
            <p className="mt-1.5 hidden line-clamp-2 text-[15px] text-brand-muted sm:block">{article.excerpt}</p>
          </div>
        </Link>
      </article>
    )
  }

  if (variant === 'numbered') {
    return (
      <article className={cn('group', className)}>
        <Link href={href} className="flex gap-4">
          <span aria-hidden className="w-8 shrink-0 font-heading text-[32px] leading-none font-bold text-brand-blue/80 group-hover:text-brand-blue">
            {String(index ?? 0).padStart(2, '0')}
          </span>
          <div className="min-w-0">
            <h3 className="line-clamp-3 font-heading text-[17px] leading-snug font-bold text-brand-navy group-hover:text-brand-blue">
              {article.title}
            </h3>
            <ArticleMeta article={article} className="mt-1.5" />
          </div>
        </Link>
      </article>
    )
  }

  // standard
  return (
    <article className={cn('group', className)}>
      <Link href={href} className="block">
        <CoverImage src={article.cover.src} alt={article.cover.alt} priority={priority} sizes="(max-width: 640px) 100vw, 33vw" className="aspect-[16/10]" />
        <div className="pt-3.5">
          <ArticleMeta article={article} />
          <h3 className="mt-1.5 line-clamp-3 text-h3 group-hover:text-brand-blue">{article.title}</h3>
          <p className="mt-1.5 line-clamp-2 text-[15px] text-brand-muted">{article.excerpt}</p>
        </div>
      </Link>
    </article>
  )
}
