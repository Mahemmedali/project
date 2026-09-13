'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    turnstile?: { render: (el: HTMLElement, opts: Record<string, unknown>) => string; remove: (id: string) => void }
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

/** Cloudflare Turnstile — açar yoxdursa heç nə render etmir. Token `cf-turnstile-response` gizli sahəsinə yazılır. */
export function Turnstile() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!SITE_KEY || !ref.current) return
    let id: string | undefined
    const render = () => {
      if (!ref.current || !window.turnstile) return
      id = window.turnstile.render(ref.current, { sitekey: SITE_KEY, size: 'flexible', appearance: 'interaction-only' })
    }
    if (window.turnstile) render()
    else {
      const s = document.createElement('script')
      s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
      s.async = true
      s.onload = render
      document.head.appendChild(s)
    }
    return () => {
      if (id) window.turnstile?.remove(id)
    }
  }, [])
  if (!SITE_KEY) return null
  return <div ref={ref} className="mt-3" />
}
