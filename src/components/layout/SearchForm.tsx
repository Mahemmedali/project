'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { IconSearch } from '@/components/brand/Icons'
import { cn } from '@/lib/utils'

export function SearchForm({
  defaultValue = '',
  size = 'md',
  autoFocus,
  className,
}: {
  defaultValue?: string
  size?: 'md' | 'lg'
  autoFocus?: boolean
  className?: string
}) {
  const t = useTranslations('search')
  const router = useRouter()
  return (
    <form
      role="search"
      className={cn('relative', className)}
      onSubmit={(e) => {
        e.preventDefault()
        const q = String(new FormData(e.currentTarget).get('q') ?? '').trim()
        router.push({ pathname: '/axtaris', query: q ? { q } : {} })
      }}
    >
      <IconSearch
        size={size === 'lg' ? 22 : 18}
        className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-brand-muted"
      />
      <input
        type="search"
        name="q"
        defaultValue={defaultValue}
        autoFocus={autoFocus}
        placeholder={t('placeholder')}
        aria-label={t('title')}
        className={cn(
          'w-full rounded-btn border border-brand-line bg-white pr-28 pl-11 text-brand-ink placeholder:text-brand-faint focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20',
          size === 'lg' ? 'h-14 text-lead' : 'h-12 text-body',
        )}
      />
      <button
        type="submit"
        className="label-caps absolute top-1/2 right-1.5 h-9 -translate-y-1/2 rounded-btn bg-brand-blue px-4 text-white hover:bg-brand-navy"
      >
        {t('button')}
      </button>
    </form>
  )
}
