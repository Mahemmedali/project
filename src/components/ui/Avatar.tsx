import Image from 'next/image'
import { cn } from '@/lib/utils'

export function Avatar({
  name,
  initials,
  src,
  size = 40,
  className,
}: {
  name: string
  initials: string
  src?: string
  size?: number
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-navy font-heading font-bold text-brand-yellow',
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      aria-hidden={!src}
    >
      {src ? <Image src={src} alt={name} width={size} height={size} /> : initials}
    </span>
  )
}
