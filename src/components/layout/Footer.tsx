import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { getCategories } from '@/lib/data'
import { LogoMark } from '@/components/brand/Logo'
import { SunriseArcs } from '@/components/brand/SunriseArcs'
import {
  IconFacebook,
  IconInstagram,
  IconLinkedin,
  IconTelegram,
  IconXSocial,
  IconYoutube,
} from '@/components/brand/Icons'
import { NewsletterForm } from '@/components/forms/NewsletterForm'
import { LocaleSwitcher } from './LocaleSwitcher'

const socials = [
  { name: 'Instagram', href: 'https://instagram.com/', Icon: IconInstagram },
  { name: 'Telegram', href: 'https://t.me/', Icon: IconTelegram },
  { name: 'Facebook', href: 'https://facebook.com/', Icon: IconFacebook },
  { name: 'YouTube', href: 'https://youtube.com/', Icon: IconYoutube },
  { name: 'X', href: 'https://x.com/', Icon: IconXSocial },
  { name: 'LinkedIn', href: 'https://linkedin.com/', Icon: IconLinkedin },
]

export async function Footer() {
  const locale = (await getLocale()) as Locale
  const t = await getTranslations('footer')
  const tn = await getTranslations('nav')
  const categories = await getCategories(locale)
  const year = new Date().getFullYear()

  return (
    <footer className="relative mt-16 overflow-hidden bg-brand-navy text-white">
      <SunriseArcs className="h-[420px]" />
      <div className="container-site relative">
        {/* Bülleten bloku */}
        <div className="grid gap-8 border-b border-white/15 py-14 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="font-heading text-[32px] leading-tight font-bold text-white lg:text-h1">{t('newsletterTitle')}</h2>
            <p className="mt-3 max-w-md text-lead text-brand-sky">{t('newsletterText')}</p>
          </div>
          <NewsletterForm tone="dark" compact />
        </div>

        {/* Keçidlər */}
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <LogoMark size={64} />
            <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-brand-sky">{t('newsletterText').split('—')[0]}</p>
            <div className="mt-6 flex gap-1.5">
              {socials.map(({ name, href, Icon }) => (
                <a
                  key={name}
                  href={href}
                  aria-label={name}
                  rel="noopener"
                  target="_blank"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-btn text-brand-sky transition-colors hover:bg-white/10 hover:text-brand-yellow"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="label-caps mb-4 text-brand-yellow">{t('sections')}</h3>
            <ul className="space-y-2.5 text-[15px]">
              {categories.map((c) => (
                <li key={c.id}>
                  <Link href={{ pathname: '/[category]', params: { category: c.slug } }} className="text-white/85 hover:text-brand-yellow">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="label-caps mb-4 text-brand-yellow">{t('company')}</h3>
            <ul className="space-y-2.5 text-[15px]">
              <li><Link href="/haqqimizda" className="text-white/85 hover:text-brand-yellow">{tn('about')}</Link></li>
              <li><Link href="/bulleten" className="text-white/85 hover:text-brand-yellow">{tn('newsletter')}</Link></li>
              <li><Link href="/elaqe" className="text-white/85 hover:text-brand-yellow">{tn('contact')}</Link></li>
              <li><Link href="/mexfilik" className="text-white/85 hover:text-brand-yellow">{tn('privacy')}</Link></li>
              <li><Link href="/istifade-sertleri" className="text-white/85 hover:text-brand-yellow">{tn('terms')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="label-caps mb-4 text-brand-yellow">{t('partners')}</h3>
            <ul className="space-y-2.5 text-[15px]">
              <li><Link href="/reklam" className="text-white/85 hover:text-brand-yellow">{tn('advertise')}</Link></li>
              <li><Link href="/media-kit" className="text-white/85 hover:text-brand-yellow">{tn('mediaKit')}</Link></li>
              <li><Link href="/korporativ" className="text-white/85 hover:text-brand-yellow">{tn('corporate')}</Link></li>
              <li><Link href="/reklam/sorgu" className="text-white/85 hover:text-brand-yellow">{tn('advertise')} — {tn('contact').toLowerCase()}</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/15 py-6 text-caption text-brand-sky sm:flex-row sm:items-center sm:justify-between">
          <p>{t('rights', { year })} · {t('madeIn')}</p>
          <LocaleSwitcher tone="dark" />
        </div>
      </div>
    </footer>
  )
}
