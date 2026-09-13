import type { Locale } from '@/i18n/routing'

const intlLocale: Record<Locale, string> = { az: 'az-Latn-AZ', en: 'en-GB', ru: 'ru-RU' }
const TZ = 'Asia/Baku'

export function formatDate(iso: string, locale: Locale, opts?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(intlLocale[locale], {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: TZ,
    ...opts,
  }).format(new Date(iso))
}

export function formatTime(iso: string, locale: Locale) {
  return new Intl.DateTimeFormat(intlLocale[locale], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: TZ,
  }).format(new Date(iso))
}

export function formatDateTime(iso: string, locale: Locale) {
  return `${formatDate(iso, locale)}, ${formatTime(iso, locale)}`
}

export function formatNumber(n: number, locale: Locale, opts?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat(intlLocale[locale], opts).format(n)
}

/** Kompakt: 18 400 → "18,4K" (AZ/RU) / "18.4K" (EN) */
export function formatCompact(n: number, locale: Locale) {
  return new Intl.NumberFormat(intlLocale[locale], { notation: 'compact', maximumFractionDigits: 1 }).format(n)
}

/** Sayt başlığı üçün bugünkü tarix: "Bazar, 13 sentyabr 2026" */
export function formatTodayLong(locale: Locale, date = new Date()) {
  return new Intl.DateTimeFormat(intlLocale[locale], {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: TZ,
  }).format(date)
}
