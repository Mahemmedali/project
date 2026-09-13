import { cn } from '@/lib/utils'

/**
 * Şəfəq qövsləri — brendin yeganə qrafik motivi.
 * Yalnız mavi/dərin göy fonlarda, 24% şəffaf Şəfəq sarısı, kompozisiyanın bir küncündə.
 * Mətn üzərinə keçmir; kəsilməsi (crop) mümkündür.
 */
export function SunriseArcs({
  className,
  opacity = 0.24,
}: {
  className?: string
  opacity?: number
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 600 480"
      preserveAspectRatio="xMaxYMax slice"
      className={cn('pointer-events-none absolute right-0 bottom-0 h-full w-auto', className)}
      fill="#F2E74B"
      fillOpacity={opacity}
    >
      <path d="M40 300 C 110 170, 250 90, 420 60 Q 452 55 455 88 L 430 380 Q 421 415 385 410 L 75 380 Q 40 376 40 345 Z" />
      <path d="M290 420 C 320 260, 400 140, 560 50 Q 592 30 600 62 L 600 480 L 330 480 Q 290 480 290 440 Z" />
      <path d="M80 420 C 220 370, 400 370, 600 420 L 600 480 L 80 480 Z" />
    </svg>
  )
}
