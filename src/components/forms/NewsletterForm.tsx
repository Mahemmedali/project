'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { IconCheck, IconMail } from '@/components/brand/Icons'
import { cn } from '@/lib/utils'

/**
 * Bülleten abunə forması. Mərhələ 1: yerli simulyasiya.
 * Mərhələ 4: POST /api/newsletter → newsletter_subscribers + Resend double opt-in.
 */
export function NewsletterForm({
  tone = 'light',
  compact = false,
  className,
}: {
  tone?: 'light' | 'dark'
  compact?: boolean
  className?: string
}) {
  const t = useTranslations('newsletter')
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'invalid'>('idle')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const email = String(new FormData(e.currentTarget).get('email') ?? '').trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setState('invalid')
    setState('loading')
    await new Promise((r) => setTimeout(r, 600)) // mock
    setState('success')
  }

  if (state === 'success') {
    return (
      <div
        className={cn(
          'flex items-center gap-3 rounded-card p-5',
          tone === 'dark' ? 'bg-white/10 text-white' : 'bg-brand-tint text-brand-navy',
          className,
        )}
        role="status"
      >
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-yellow text-brand-navy">
          <IconCheck size={20} />
        </span>
        <p className="text-body font-medium">{t('success')}</p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className={cn('w-full', className)} noValidate>
      <div className={cn('flex flex-col gap-3', compact && 'sm:flex-row')}>
        <label className="sr-only" htmlFor={`nl-email-${tone}`}>
          {t('emailLabel')}
        </label>
        <div className="relative flex-1">
          <IconMail size={18} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-brand-faint" />
          <input
            id={`nl-email-${tone}`}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            placeholder={t('emailPlaceholder')}
            aria-invalid={state === 'invalid'}
            onChange={() => state === 'invalid' && setState('idle')}
            className={cn(
              'h-13 w-full rounded-btn border pr-4 pl-11 text-body focus:outline-none focus:ring-2',
              tone === 'dark'
                ? 'border-white/20 bg-white text-brand-ink placeholder:text-brand-faint focus:ring-brand-yellow/60'
                : 'border-brand-line bg-white text-brand-ink placeholder:text-brand-faint focus:border-brand-blue focus:ring-brand-blue/20',
              state === 'invalid' && 'border-brand-alert',
            )}
          />
        </div>
        <button
          type="submit"
          disabled={state === 'loading'}
          className={cn(
            'label-caps inline-flex h-13 shrink-0 items-center justify-center rounded-btn px-7 transition-colors disabled:opacity-60',
            tone === 'dark' ? 'bg-brand-yellow text-brand-navy hover:bg-brand-gold' : 'bg-brand-blue text-white hover:bg-brand-navy',
          )}
        >
          {state === 'loading' ? '…' : t('cta')}
        </button>
      </div>
      {state === 'invalid' && (
        <p className={cn('mt-2 text-caption', tone === 'dark' ? 'text-brand-yellow' : 'text-brand-alert')} role="alert">
          {t('invalid')}
        </p>
      )}
      <p className={cn('mt-3 text-caption', tone === 'dark' ? 'text-brand-sky' : 'text-brand-faint')}>
        {t.rich('consent', {
          privacy: (chunks) => (
            <Link href="/mexfilik" className="underline hover:text-brand-blue">
              {chunks}
            </Link>
          ),
        })}
      </p>
    </form>
  )
}
