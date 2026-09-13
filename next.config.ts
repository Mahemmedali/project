import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import { withPayload } from '@payloadcms/next/withPayload'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      ...(process.env.R2_PUBLIC_URL ? [{ protocol: 'https' as const, hostname: new URL(process.env.R2_PUBLIC_URL).hostname }] : []),
    ],
  },
  async headers() {
    // HSTS və upgrade-insecure-requests yalnız real HTTPS domendə (lokal `next start` http-dir)
    const isHttps = (process.env.NEXT_PUBLIC_SITE_URL ?? '').startsWith('https://')
    // Sayt üçün CSP (admin paneli istisna — Payload öz inline skriptlərindən istifadə edir)
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com https://challenges.cloudflare.com https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline'",
      `img-src 'self' data: blob: https:`,
      "font-src 'self' data:",
      "connect-src 'self' https://cloudflareinsights.com https://*.google-analytics.com https://*.analytics.google.com https://challenges.cloudflare.com",
      "frame-src 'self' https://challenges.cloudflare.com",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      ...(isHttps ? ['upgrade-insecure-requests'] : []),
    ].join('; ')
    const common = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
      ...(isHttps ? [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }] : []),
    ]
    return [
      { source: '/((?!admin|api).*)', headers: [...common, { key: 'X-Frame-Options', value: 'SAMEORIGIN' }, { key: 'Content-Security-Policy', value: csp }] },
      { source: '/(admin|api)/(.*)', headers: common },
    ]
  },
}

export default withPayload(withNextIntl(nextConfig), { devBundleServerPackages: false })
