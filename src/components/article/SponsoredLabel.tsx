import { useTranslations } from 'next-intl'
import type { Partner } from '@/lib/types'
import { Badge } from '@/components/ui/Badge'

/** Şəffaflıq qaydası: sponsorlu material həmişə etiketlənir və redaksiya məzmunundan vizual fərqlənir */
export function SponsoredLabel({ partner }: { partner?: Partner }) {
  const t = useTranslations('article')
  return (
    <aside className="flex flex-col gap-3 rounded-card border border-brand-gold/50 bg-brand-gold/10 p-4 sm:flex-row sm:items-center">
      <Badge variant="sponsored" className="shrink-0">
        {t('sponsored')}
      </Badge>
      <div className="text-[14px] leading-snug text-brand-ink">
        {partner && (
          <p className="font-semibold">
            {t('sponsoredBy', { partner: partner.name })}
          </p>
        )}
        <p className="text-brand-muted">{t('sponsoredNote')}</p>
      </div>
    </aside>
  )
}
