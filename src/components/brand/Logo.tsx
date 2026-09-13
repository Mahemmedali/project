import Image from 'next/image'
import { cn } from '@/lib/utils'

/**
 * Rəsmi loqo — yalnız təqdim olunmuş faylla (vektor/PNG). Rəng, nisbət, kölgə dəyişdirilmir.
 * Minimum ölçü: 48 px (rəqəmsal).
 */
export function LogoMark({ size = 48, className, priority }: { size?: number; className?: string; priority?: boolean }) {
  return (
    <Image
      src="/brand/gmb-logo.png"
      alt="Good Morning Baku"
      width={size}
      height={size}
      priority={priority}
      className={cn('shrink-0 rounded-[8%]', className)}
      style={{ width: size, height: size }}
    />
  )
}

/** Loqo + yazı (yalnız ağ/açıq fonda; mavi fonda LogoMark tək istifadə olunur) */
export function LogoLockup({
  size = 48,
  className,
  tone = 'navy',
  priority,
}: {
  size?: number
  className?: string
  tone?: 'navy' | 'white'
  priority?: boolean
}) {
  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <LogoMark size={size} priority={priority} />
      <span
        className={cn(
          'font-heading leading-none font-bold',
          tone === 'navy' ? 'text-brand-navy' : 'text-white',
        )}
        style={{ fontSize: size * 0.42 }}
      >
        Good Morning
        <br />
        Baku
      </span>
    </span>
  )
}
