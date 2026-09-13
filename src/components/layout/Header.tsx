import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { getCategories, getWeather } from '@/lib/data'
import { formatTodayLong } from '@/lib/format'
import { LogoMark } from '@/components/brand/Logo'
import { IconCloud, IconRain, IconSearch, IconSun, IconWind } from '@/components/brand/Icons'
import { buttonClasses } from '@/components/ui/Button'
import { LocaleSwitcher } from './LocaleSwitcher'
import { MobileNav } from './MobileNav'

const weatherIcons = { sun: IconSun, cloud: IconCloud, rain: IconRain, wind: IconWind }

export async function Header() {
  const locale = (await getLocale()) as Locale
  const t = await getTranslations('nav')
  const ts = await getTranslations('site')
  const [categories, weather] = await Promise.all([getCategories(locale), getWeather()])
  const WeatherIcon = weatherIcons[weather.icon]

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      {/* Üst zolaq: tarix + hava + dil */}
      <div className="hidden border-b border-brand-line lg:block">
        <div className="container-site flex h-9 items-center justify-between text-caption text-brand-muted">
          <div className="flex items-center gap-5">
            <span className="capitalize">{formatTodayLong(locale)}</span>
            <span className="inline-flex items-center gap-1.5">
              <WeatherIcon size={16} className="text-brand-blue" />
              <span className="font-medium text-brand-navy">
                {weather.city[locale]} {weather.tempDay}°C
              </span>
              <span>· {weather.condition[locale]}</span>
            </span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/reklam" className="hover:text-brand-blue">
              {t('forPartners')}
            </Link>
            <LocaleSwitcher />
          </div>
        </div>
      </div>

      {/* Əsas sətir */}
      <div className="border-b border-brand-line">
        <div className="container-site flex h-16 items-center justify-between gap-4 lg:h-[76px]">
          <Link href="/" className="flex items-center gap-3" aria-label={ts('name')}>
            <LogoMark size={48} priority className="lg:hidden" />
            <LogoMark size={56} priority className="hidden lg:block" />
            <span className="hidden font-heading text-[17px] leading-tight font-bold text-brand-navy sm:block">
              Good Morning
              <br />
              Baku
            </span>
          </Link>

          <nav aria-label={t('menu')} className="hidden items-center gap-1 lg:flex">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={{ pathname: '/[category]', params: { category: c.slug } }}
                className="rounded-btn px-3.5 py-2 text-[15px] font-medium text-brand-navy transition-colors hover:bg-brand-tint hover:text-brand-blue"
              >
                {c.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 lg:gap-3">
            <Link
              href="/axtaris"
              aria-label={t('search')}
              className="inline-flex h-10 w-10 items-center justify-center rounded-btn text-brand-navy hover:bg-brand-tint"
            >
              <IconSearch size={22} />
            </Link>
            <Link href="/bulleten" className={buttonClasses('primary', 'md', 'hidden sm:inline-flex')}>
              {t('subscribe')}
            </Link>
            <MobileNav categories={categories} />
          </div>
        </div>
      </div>
    </header>
  )
}
