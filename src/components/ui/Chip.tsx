import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function chipClasses(active = false, className?: string) {
  return cn(
    'inline-flex h-9 items-center rounded-chip border px-4 text-[14px] font-medium transition-colors',
    active
      ? 'border-brand-blue bg-brand-blue text-white'
      : 'border-brand-line bg-white text-brand-navy hover:border-brand-blue hover:text-brand-blue',
    className,
  )
}

export function Chip({ children, active, className }: { children: ReactNode; active?: boolean; className?: string }) {
  return <span className={chipClasses(active, className)}>{children}</span>
}
