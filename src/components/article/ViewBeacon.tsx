'use client'

import { useEffect } from 'react'

/** Səhifə açılanda bir dəfə baxış sayğacına siqnal göndərir (yalnız CMS rejimində, mock id-lər rəqəm deyil) */
export function ViewBeacon({ id }: { id: string }) {
  useEffect(() => {
    if (!/^\d+$/.test(id)) return
    const key = `viewed:${id}`
    try {
      if (sessionStorage.getItem(key)) return
      sessionStorage.setItem(key, '1')
    } catch {}
    const url = `/api/articles/${id}/view`
    if (navigator.sendBeacon) navigator.sendBeacon(url, new Blob([], { type: 'application/json' }))
    else fetch(url, { method: 'POST', keepalive: true }).catch(() => {})
  }, [id])
  return null
}
