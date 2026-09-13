'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'

export default function LocaleError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations('error')
  useEffect(() => {
    console.error(error)
  }, [error])
  return (
    <div className="container-site py-16">
      <div className="mx-auto max-w-lg rounded-card bg-brand-tint p-8 text-center">
        <h1 className="text-h2">{t('title')}</h1>
        <p className="mt-2 text-body text-brand-muted">{t('text')}</p>
        {error.digest && <p className="mt-1 font-mono text-caption text-brand-faint">{error.digest}</p>}
        <Button onClick={reset} className="mt-6">
          {t('retry')}
        </Button>
      </div>
    </div>
  )
}
