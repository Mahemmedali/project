'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Locale } from '@/i18n/routing'

/**
 * Səhifə öz dil alternativlərini (məs. məqalənin EN/RU slug-ları) qeyd edir,
 * Header-dəki dil keçidi bunlardan istifadə edir. Alternativ yoxdursa — həmin dildə keçid passiv olur.
 */
export type AlternateLinks = Partial<Record<Locale, string>> | null

const Ctx = createContext<{ links: AlternateLinks; set: (l: AlternateLinks) => void }>({
  links: null,
  set: () => {},
})

export function AlternatesProvider({ children }: { children: ReactNode }) {
  const [links, set] = useState<AlternateLinks>(null)
  return <Ctx.Provider value={{ links, set }}>{children}</Ctx.Provider>
}

export function useAlternates() {
  return useContext(Ctx)
}

/** Səhifədə render edilir: `<SetAlternates links={{ az: '/az/seher/x', en: '/en/city/y' }} />` */
export function SetAlternates({ links }: { links: AlternateLinks }) {
  const { set } = useAlternates()
  const key = JSON.stringify(links)
  useEffect(() => {
    set(links)
    return () => set(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
  return null
}
