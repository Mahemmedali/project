import type { ComponentPropsWithoutRef, ElementType } from 'react'
import { cn } from '@/lib/utils'

type CardProps<T extends ElementType> = {
  as?: T
  tone?: 'white' | 'tint' | 'blue' | 'navy'
  padded?: boolean
  hover?: boolean
  className?: string
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className'>

const tones = {
  white: 'bg-white border border-brand-line',
  tint: 'bg-brand-tint',
  blue: 'bg-brand-blue text-white',
  navy: 'bg-brand-navy text-white',
}

export function Card<T extends ElementType = 'div'>({
  as,
  tone = 'white',
  padded = true,
  hover = false,
  className,
  ...rest
}: CardProps<T>) {
  const Comp = (as ?? 'div') as ElementType
  return (
    <Comp
      className={cn(
        'relative overflow-hidden rounded-card',
        tones[tone],
        padded && 'p-6',
        hover && 'transition-shadow duration-200 hover:shadow-card',
        className,
      )}
      {...rest}
    />
  )
}
