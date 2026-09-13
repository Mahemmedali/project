'use client'

import { RefreshRouteOnSave } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'

/** Qaralama rejimi zolağı + CMS-də dəyişiklik olanda avtomatik yeniləmə */
export function PreviewBar({ serverURL }: { serverURL: string }) {
  const router = useRouter()
  const pathname = usePathname()
  return (
    <>
      <RefreshRouteOnSave refresh={() => router.refresh()} serverURL={serverURL} />
      <div className="sticky top-0 z-50 flex items-center justify-between bg-brand-gold px-4 py-2 text-[13px] font-semibold text-brand-ink">
        <span>Önizləmə rejimi — qaralama görünür</span>
        <a href={`/preview/exit?to=${encodeURIComponent(pathname)}`} className="underline">
          Çıx
        </a>
      </div>
    </>
  )
}
