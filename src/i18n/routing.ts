import { defineRouting } from 'next-intl/routing'

export const locales = ['az', 'en', 'ru'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'az'

export const localeNames: Record<Locale, string> = { az: 'AZ', en: 'EN', ru: 'RU' }
export const localeLabels: Record<Locale, string> = {
  az: 'Azərbaycanca',
  en: 'English',
  ru: 'Русский',
}

/**
 * Lokallaşdırılmış yollar. Daxili (kanonik) ad AZ variantıdır.
 * `[category]` və `[slug]` seqmentləri kolleksiyalardan (mock/CMS) gəlir.
 */
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'always',
  localeDetection: true,
  pathnames: {
    '/': '/',
    '/[category]': '/[category]',
    '/[category]/[slug]': '/[category]/[slug]',
    '/axtaris': { az: '/axtaris', en: '/search', ru: '/poisk' },
    '/muellif/[slug]': { az: '/muellif/[slug]', en: '/author/[slug]', ru: '/avtor/[slug]' },
    '/teq/[slug]': { az: '/teq/[slug]', en: '/tag/[slug]', ru: '/teg/[slug]' },
    '/bulleten': { az: '/bulleten', en: '/newsletter', ru: '/rassylka' },
    '/haqqimizda': { az: '/haqqimizda', en: '/about', ru: '/o-nas' },
    '/elaqe': { az: '/elaqe', en: '/contact', ru: '/kontakty' },
    '/mexfilik': { az: '/mexfilik', en: '/privacy', ru: '/konfidencialnost' },
    '/istifade-sertleri': { az: '/istifade-sertleri', en: '/terms', ru: '/usloviya' },
    '/reklam': { az: '/reklam', en: '/advertise', ru: '/reklama' },
    '/reklam/sorgu': { az: '/reklam/sorgu', en: '/advertise/request', ru: '/reklama/zayavka' },
    '/media-kit': '/media-kit',
    '/korporativ': { az: '/korporativ', en: '/corporate', ru: '/korporativnym' },
  },
})

export type AppPathnames = keyof typeof routing.pathnames
