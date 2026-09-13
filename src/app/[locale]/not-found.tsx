import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { SunriseArcs } from '@/components/brand/SunriseArcs'
import { buttonClasses } from '@/components/ui/Button'

export default function NotFound() {
  const t = useTranslations('notFound')
  return (
    <div className="container-site py-10">
      <div className="relative overflow-hidden rounded-card bg-brand-blue px-6 py-20 text-white sm:px-12">
        <SunriseArcs className="h-[160%]" />
        <div className="relative max-w-lg">
          <p className="font-heading text-[96px] leading-none font-black text-brand-yellow">404</p>
          <h1 className="mt-4 text-h1 text-white">{t('title')}</h1>
          <p className="mt-3 text-lead text-brand-sky">{t('text')}</p>
          <Link href="/" className={buttonClasses('yellow', 'lg', 'mt-8')}>
            {t('cta')}
          </Link>
        </div>
      </div>
    </div>
  )
}
