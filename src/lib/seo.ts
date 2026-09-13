import type { Metadata } from 'next'
import { getPathname } from '@/i18n/navigation'
import { locales, type Locale, type AppPathnames } from '@/i18n/routing'

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://goodmorningbaku.com'
export const SITE_NAME = 'Good Morning Baku'

type Href = Parameters<typeof getPathname>[0]['href']

/** Statik marşrut üçün kanonik + hreflang alternativləri */
export function alternatesFor(locale: Locale, href: Href): NonNullable<Metadata['alternates']> {
  const languages: Record<string, string> = {}
  for (const l of locales) languages[l] = SITE_URL + getPathname({ href, locale: l, forcePrefix: true })
  languages['x-default'] = languages.az
  return { canonical: SITE_URL + getPathname({ href, locale, forcePrefix: true }), languages }
}

/** Dinamik məzmun üçün: yalnız mövcud tərcümələr hreflang-a düşür */
export function alternatesFromPaths(locale: Locale, paths: Partial<Record<Locale, string>>): NonNullable<Metadata['alternates']> {
  const languages: Record<string, string> = {}
  for (const l of locales) if (paths[l]) languages[l] = SITE_URL + paths[l]
  if (paths.az) languages['x-default'] = SITE_URL + paths.az
  return { canonical: SITE_URL + (paths[locale] ?? ''), languages }
}

export function pageMetadata(opts: {
  title: string
  description?: string
  locale: Locale
  alternates: NonNullable<Metadata['alternates']>
  image?: string
  type?: 'website' | 'article'
  publishedTime?: string
  authors?: string[]
}): Metadata {
  const ogLocale = { az: 'az_AZ', en: 'en_GB', ru: 'ru_RU' }[opts.locale]
  return {
    title: opts.title,
    description: opts.description,
    alternates: opts.alternates,
    openGraph: {
      title: opts.title,
      description: opts.description,
      siteName: SITE_NAME,
      locale: ogLocale,
      type: opts.type ?? 'website',
      url: typeof opts.alternates.canonical === 'string' ? opts.alternates.canonical : undefined,
      images: opts.image ? [{ url: opts.image }] : undefined,
      ...(opts.type === 'article' ? { publishedTime: opts.publishedTime, authors: opts.authors } : {}),
    },
    twitter: { card: 'summary_large_image', title: opts.title, description: opts.description },
  }
}

export type { AppPathnames }
