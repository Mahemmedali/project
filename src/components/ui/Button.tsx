import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type ButtonVariant = 'primary' | 'secondary' | 'yellow' | 'ghost' | 'white' | 'outlineWhite'
export type ButtonSize = 'sm' | 'md' | 'lg'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-brand-blue text-white hover:bg-brand-navy',
  secondary: 'border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white',
  yellow: 'bg-brand-yellow text-brand-navy hover:bg-brand-gold',
  ghost: 'text-brand-blue hover:bg-brand-tint',
  white: 'bg-white text-brand-navy hover:bg-brand-tint',
  outlineWhite: 'border-2 border-white/70 text-white hover:border-white hover:bg-white/10',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-[13px]',
  md: 'h-11 px-5 text-[13px]',
  lg: 'h-13 px-7 text-[14px]',
}

export const buttonClasses = (variant: ButtonVariant = 'primary', size: ButtonSize = 'md', className?: string) =>
  cn(
    'inline-flex items-center justify-center gap-2 rounded-btn font-body font-semibold tracking-[0.06em] uppercase whitespace-nowrap transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50',
    variants[variant],
    sizes[size],
    className,
  )

type ButtonProps<T extends ElementType> = {
  as?: T
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  children: ReactNode
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className' | 'children'>

export function Button<T extends ElementType = 'button'>({
  as,
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}: ButtonProps<T>) {
  const Comp = (as ?? 'button') as ElementType
  const extra = Comp === 'button' && !('type' in rest) ? { type: 'button' } : {}
  return (
    <Comp className={buttonClasses(variant, size, className)} {...extra} {...rest}>
      {children}
    </Comp>
  )
}
