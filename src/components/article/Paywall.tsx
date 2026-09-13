import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { IconLock } from '@/components/brand/Icons'
import { SunriseArcs } from '@/components/brand/SunriseArcs'
import { buttonClasses } from '@/components/ui/Button'

/** Premium paywall — model hazırdır, ödəniş v2-də aktivləşir. İndi "xəbər ver" CTA-sı bülletenə aparır. */
export function Paywall() {
  const t = useTranslations('article')
  return (
    <div className="relative mt-6 overflow-hidden rounded-card bg-brand-navy p-8 text-white">
      <SunriseArcs className="h-[140%]" />
      <div className="relative max-w-md">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-brand-yellow text-brand-navy">
          <IconLock size={22} />
        </span>
        <h2 className="mt-4 text-h3 text-white sm:text-h2">{t('paywallTitle')}</h2>
        <p className="mt-2 text-body text-brand-sky">{t('paywallText')}</p>
        <Link href="/bulleten" className={buttonClasses('yellow', 'md', 'mt-6')}>
          {t('paywallCta')}
        </Link>
      </div>
    </div>
  )
}
