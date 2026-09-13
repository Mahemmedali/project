import type { ReactNode } from 'react'
import { SunriseArcs } from '@/components/brand/SunriseArcs'
import { cn } from '@/lib/utils'

/** Statik / B2B səhifələr üçün başlıq bloku */
export function PageHero({
  eyebrow,
  title,
  lead,
  tone = 'light',
  children,
  className,
}: {
  eyebrow?: string
  title: string
  lead?: string
  tone?: 'light' | 'blue' | 'navy'
  children?: ReactNode
  className?: string
}) {
  const dark = tone !== 'light'
  return (
    <section className={cn('relative overflow-hidden', tone === 'blue' && 'bg-brand-blue', tone === 'navy' && 'bg-brand-navy', className)}>
      {dark && <SunriseArcs className="h-[140%]" />}
      <div className={cn('container-site relative', dark ? 'py-14 lg:py-20' : 'pt-10 pb-6 lg:pt-14')}>
        <div className="max-w-3xl">
          {eyebrow && <p className={cn('label-caps mb-3', dark ? 'text-brand-yellow' : 'text-brand-blue')}>{eyebrow}</p>}
          <h1 className={cn('text-[34px] leading-[1.15] sm:text-h1 lg:text-[52px] lg:leading-[1.1]', dark && 'text-white')}>{title}</h1>
          {lead && <p className={cn('mt-4 text-lead', dark ? 'text-brand-sky' : 'text-brand-muted')}>{lead}</p>}
          {children && <div className="mt-8">{children}</div>}
        </div>
      </div>
    </section>
  )
}
