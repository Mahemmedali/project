'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

const CF_TOKEN = process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN
const GA_ID = process.env.NEXT_PUBLIC_GA_ID
const KEY = 'gmb-consent'

/**
 * Cloudflare Web Analytics — cookie-siz, razılıq tələb etmir (həmişə).
 * GA4 — yalnız oxucu razılıq verəndə (cookie banneri). Heç bir açar yoxdursa heç nə render olunmur.
 */
export function Analytics() {
  const t = useTranslations('consent')
  const [consent, setConsent] = useState<'unknown' | 'granted' | 'denied'>('unknown')

  useEffect(() => {
    try {
      const v = localStorage.getItem(KEY)
      if (v === 'granted' || v === 'denied') setConsent(v)
    } catch {}
  }, [])

  const decide = (v: 'granted' | 'denied') => {
    setConsent(v)
    try {
      localStorage.setItem(KEY, v)
    } catch {}
  }

  return (
    <>
      {CF_TOKEN && (
        <Script
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon={JSON.stringify({ token: CF_TOKEN })}
          strategy="afterInteractive"
        />
      )}
      {GA_ID && consent === 'granted' && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true});`}
          </Script>
        </>
      )}
      {GA_ID && consent === 'unknown' && (
        <div
          role="dialog"
          aria-label={t('title')}
          className="fixed inset-x-4 bottom-4 z-40 mx-auto max-w-xl rounded-card border border-brand-line bg-white p-5 shadow-float"
        >
          <p className="text-[15px] font-semibold text-brand-navy">{t('title')}</p>
          <p className="mt-1 text-[14px] text-brand-muted">
            {t('text')}{' '}
            <Link href="/mexfilik" className="underline hover:text-brand-blue">
              {t('more')}
            </Link>
          </p>
          <div className="mt-4 flex gap-2">
            <button type="button" onClick={() => decide('granted')} className="label-caps h-10 rounded-btn bg-brand-blue px-4 text-white hover:bg-brand-navy">
              {t('accept')}
            </button>
            <button type="button" onClick={() => decide('denied')} className="label-caps h-10 rounded-btn border border-brand-line px-4 text-brand-navy hover:bg-brand-tint">
              {t('decline')}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
