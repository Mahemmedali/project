'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { IconCheck, IconFacebook, IconLink, IconTelegram, IconXSocial } from '@/components/brand/Icons'
import { cn } from '@/lib/utils'

export function ShareButtons({ title, className }: { title: string; className?: string }) {
  const t = useTranslations('article')
  const [copied, setCopied] = useState(false)
  const url = typeof window !== 'undefined' ? window.location.href : ''
  const enc = encodeURIComponent

  const btn =
    'inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-line text-brand-navy transition-colors hover:border-brand-blue hover:text-brand-blue'

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="label-caps mr-1 text-brand-faint">{t('share')}</span>
      <a className={btn} aria-label="Telegram" target="_blank" rel="noopener" href={`https://t.me/share/url?url=${enc(url)}&text=${enc(title)}`}>
        <IconTelegram size={18} />
      </a>
      <a className={btn} aria-label="Facebook" target="_blank" rel="noopener" href={`https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`}>
        <IconFacebook size={18} />
      </a>
      <a className={btn} aria-label="X" target="_blank" rel="noopener" href={`https://x.com/intent/tweet?url=${enc(url)}&text=${enc(title)}`}>
        <IconXSocial size={18} />
      </a>
      <button
        type="button"
        className={cn(btn, copied && 'border-brand-blue bg-brand-blue text-white hover:text-white')}
        aria-label={copied ? t('copied') : t('copyLink')}
        title={copied ? t('copied') : t('copyLink')}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(window.location.href)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
          } catch {}
        }}
      >
        {copied ? <IconCheck size={18} /> : <IconLink size={18} />}
      </button>
    </div>
  )
}
