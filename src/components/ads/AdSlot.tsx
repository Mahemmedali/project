import Image from 'next/image'
import { getLocale, getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import type { AdSlotKey } from '@/lib/types'
import { getAd } from '@/lib/data'
import { cn } from '@/lib/utils'

/**
 * Reklam slotu — CMS-dən idarə olunur. Aktiv kampaniya yoxdursa brend üslubunda placeholder.
 * Reklam sahəsi həmişə "Reklam" etiketi ilə (brend kitabı, bölmə 08).
 * Mərhələ 5-də HTML kreativlər sandbox iframe-də render olunacaq.
 */
export async function AdSlot({ slot, className }: { slot: AdSlotKey; className?: string }) {
  const locale = (await getLocale()) as Locale
  const t = await getTranslations('article')
  const ad = await getAd(slot, locale)
  if (!ad) return null
  const { slot: s, campaign } = ad
  const isTall = s.size.h > s.size.w

  return (
    <div className={cn('w-full', className)} data-ad-slot={slot}>
      <p className="label-caps mb-1.5 text-center text-[11px] text-brand-faint">{t('ad')}</p>
      {campaign?.html ? (
        <div className="mx-auto overflow-hidden rounded-card" style={{ maxWidth: s.size.w, aspectRatio: `${s.size.w} / ${s.size.h}` }}>
          <iframe
            title={t('ad')}
            sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
            srcDoc={campaign.html}
            className="h-full w-full border-0"
            loading="lazy"
          />
        </div>
      ) : campaign?.creative ? (
        <a
          href={campaign.url}
          target="_blank"
          rel="noopener sponsored"
          className="mx-auto block overflow-hidden rounded-card"
          style={{ maxWidth: s.size.w }}
        >
          <Image
            src={campaign.creative.src}
            alt={campaign.creative.alt}
            width={campaign.creative.w ?? s.size.w}
            height={campaign.creative.h ?? s.size.h}
            className="h-auto w-full"
            unoptimized
          />
        </a>
      ) : (
        <div
          className={cn(
            'mx-auto flex items-center justify-center rounded-card border border-dashed border-brand-line bg-brand-surface text-caption text-brand-faint',
            isTall ? 'aspect-[1/2] max-w-[300px]' : 'w-full',
          )}
          style={!isTall ? { maxWidth: s.size.w, aspectRatio: `${s.size.w} / ${s.size.h}` } : undefined}
        >
          {s.size.w}×{s.size.h}
        </div>
      )}
    </div>
  )
}
