'use client'

import { useLocale, useTranslations } from 'next-intl'
import { getPathname, usePathname } from '@/i18n/navigation'
import { locales, localeNames, localeLabels, type Locale } from '@/i18n/routing'
import { useAlternates } from './AlternatesContext'
import { cn } from '@/lib/utils'

export function LocaleSwitcher({ tone = 'light', className }: { tone?: 'light' | 'dark'; className?: string }) {
  const locale = useLocale() as Locale
  const t = useTranslations('nav')
  const pathname = usePathname()
  const { links } = useAlternates()

  return (
    <nav aria-label={t('language')} className={cn('flex items-center gap-0.5', className)}>
      {locales.map((l) => {
        const active = l === locale
        // Alternativ qeyd olunubsa onu, yoxdursa statik səhifə üçün eyni yolu istifadə et
        const isDynamic = pathname.includes('[')
        const href = links
          ? links[l]
          : isDynamic
            ? undefined
            : getPathname({ href: pathname as '/', locale: l, forcePrefix: true })
        const disabled = !active && !href
        const cls = cn(
          'label-caps inline-flex h-8 items-center rounded-[6px] px-2 transition-colors',
          tone === 'light'
            ? active
              ? 'bg-brand-navy text-brand-yellow'
              : 'text-brand-muted hover:bg-brand-tint hover:text-brand-navy'
            : active
              ? 'bg-brand-yellow text-brand-navy'
              : 'text-brand-sky hover:bg-white/10 hover:text-white',
          disabled && 'cursor-not-allowed opacity-40 hover:bg-transparent',
        )
        if (active || disabled) {
          return (
            <span key={l} className={cls} aria-current={active ? 'true' : undefined} title={localeLabels[l]}>
              {localeNames[l]}
            </span>
          )
        }
        return (
          <a key={l} href={href!} hrefLang={l} lang={l} className={cls} title={localeLabels[l]}>
            {localeNames[l]}
          </a>
        )
      })}
    </nav>
  )
}
