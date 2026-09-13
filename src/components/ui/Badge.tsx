import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import type { CategoryColor } from '@/lib/types'

export type BadgeVariant = 'category' | 'ad' | 'sponsored' | 'breaking' | 'premium' | 'neutral' | 'onBlue'

const variants: Record<BadgeVariant, string> = {
  category: 'bg-brand-blue text-white',
  ad: 'bg-brand-gold text-brand-ink',
  sponsored: 'bg-brand-gold text-brand-ink',
  breaking: 'bg-brand-gold text-brand-ink',
  premium: 'bg-brand-navy text-brand-yellow',
  neutral: 'bg-brand-tint text-brand-navy',
  onBlue: 'bg-brand-yellow text-brand-navy',
}

const categoryColors: Record<CategoryColor, string> = {
  blue: 'bg-brand-blue text-white',
  navy: 'bg-brand-navy text-white',
  gold: 'bg-brand-gold text-brand-ink',
  yellow: 'bg-brand-yellow text-brand-navy',
}

export function Badge({
  variant = 'category',
  color,
  className,
  children,
}: {
  variant?: BadgeVariant
  color?: CategoryColor
  className?: string
  children: ReactNode
}) {
  return (
    <span
      className={cn(
        'label-caps inline-flex h-6 items-center rounded-[4px] px-2',
        variant === 'category' && color ? categoryColors[color] : variants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
