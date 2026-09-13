import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { Inter } from 'next/font/google'
import { preload } from 'react-dom'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { routing, type Locale } from '@/i18n/routing'
import { SITE_NAME, SITE_URL } from '@/lib/seo'
import { Header } from '@/components/layout/Header'
import { Ticker } from '@/components/layout/Ticker'
import { Footer } from '@/components/layout/Footer'
import { AlternatesProvider } from '@/components/layout/AlternatesContext'
import { Analytics } from '@/components/layout/Analytics'
import '@/styles/globals.css'

/* Inter — next/font (variable, build zamanı self-host). Merriweather — public/fonts (bax globals.css) */
const inter = Inter({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
  preload: false,
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'site' })
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: `${SITE_NAME} — ${t('tagline')}`, template: `%s — ${SITE_NAME}` },
    description: t('description'),
    applicationName: SITE_NAME,
    openGraph: { siteName: SITE_NAME, type: 'website', images: ['/brand/gmb-og.png'] },
    robots: { index: true, follow: true },
  }
}

export const viewport: Viewport = {
  themeColor: '#0424D9',
  width: 'device-width',
  initialScale: 1,
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale as Locale)
  const t = await getTranslations('nav')
  // Başlıq şriftinin yalnız bu dil üçün lazım olan alt-dəstlərini əvvəlcədən yüklə (LCP)
  for (const sub of locale === 'ru' ? ['latin', 'cyrillic'] : ['latin', 'latin-ext']) {
    preload(`/fonts/merriweather-${sub}-700-normal.woff2`, { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' })
  }

  return (
    <html lang={locale} className={inter.variable}>
      <body className="flex min-h-screen flex-col">
        <NextIntlClientProvider>
          <AlternatesProvider>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-btn focus:bg-brand-yellow focus:px-4 focus:py-2 focus:text-brand-navy"
            >
              {t('skipToContent')}
            </a>
            <Header />
            <Ticker />
            <main id="main" className="flex-1">
              {children}
            </main>
            <Footer />
            <Analytics />
          </AlternatesProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
