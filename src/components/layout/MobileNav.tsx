'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import type { CategoryView } from '@/lib/types'
import { IconMenu, IconX } from '@/components/brand/Icons'
import { LogoMark } from '@/components/brand/Logo'
import { SunriseArcs } from '@/components/brand/SunriseArcs'
import { LocaleSwitcher } from './LocaleSwitcher'
import { SearchForm } from './SearchForm'
import { buttonClasses } from '@/components/ui/Button'

export function MobileNav({ categories }: { categories: CategoryView[] }) {
  const [open, setOpen] = useState(false)
  const t = useTranslations('nav')

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <button
        type="button"
        aria-label={t('menu')}
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-btn text-brand-navy hover:bg-brand-tint lg:hidden"
      >
        <IconMenu size={24} />
      </button>

      {/* Portal: header-in backdrop-filter-i fixed elementlər üçün containing block yaradır */}
      {open &&
        createPortal(
        <div className="fixed inset-0 z-50 flex flex-col bg-brand-navy text-white lg:hidden" role="dialog" aria-modal="true">
          <SunriseArcs className="h-[60%] opacity-100" />
          <div className="relative flex items-center justify-between px-4 py-3">
            <LogoMark size={44} />
            <button
              type="button"
              aria-label={t('close')}
              onClick={() => setOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-btn text-white hover:bg-white/10"
            >
              <IconX size={26} />
            </button>
          </div>
          <div className="relative flex-1 overflow-y-auto px-4 pb-8">
            <div onClick={() => setOpen(false)}>
              <SearchForm className="mb-6" />
            </div>
            <ul className="space-y-1">
              {categories.map((c) => (
                <li key={c.id}>
                  <Link
                    href={{ pathname: '/[category]', params: { category: c.slug } }}
                    onClick={() => setOpen(false)}
                    className="block py-3 font-heading text-[26px] font-bold text-white hover:text-brand-yellow"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-white/15 pt-6 text-[15px]">
              <Link href="/bulleten" onClick={() => setOpen(false)} className="py-1 text-brand-sky hover:text-white">
                {t('newsletter')}
              </Link>
              <Link href="/reklam" onClick={() => setOpen(false)} className="py-1 text-brand-sky hover:text-white">
                {t('advertise')}
              </Link>
              <Link href="/haqqimizda" onClick={() => setOpen(false)} className="py-1 text-brand-sky hover:text-white">
                {t('about')}
              </Link>
              <Link href="/media-kit" onClick={() => setOpen(false)} className="py-1 text-brand-sky hover:text-white">
                {t('mediaKit')}
              </Link>
              <Link href="/elaqe" onClick={() => setOpen(false)} className="py-1 text-brand-sky hover:text-white">
                {t('contact')}
              </Link>
              <Link href="/korporativ" onClick={() => setOpen(false)} className="py-1 text-brand-sky hover:text-white">
                {t('corporate')}
              </Link>
            </div>
            <div className="mt-8 flex items-center justify-between">
              <LocaleSwitcher tone="dark" />
              <Link href="/bulleten" onClick={() => setOpen(false)} className={buttonClasses('yellow', 'md')}>
                {t('subscribe')}
              </Link>
            </div>
          </div>
        </div>,
        document.body,
        )}
    </>
  )
}
