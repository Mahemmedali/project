import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { IconArrowRight } from '@/components/brand/Icons'

/** Bölmə başlığı: sol tərəfdə sarı vurğu, sağda "Hamısına bax" keçidi */
export function SectionHeading({
  title,
  eyebrow,
  action,
  className,
  tone = 'navy',
  as: Tag = 'h2',
}: {
  title: ReactNode
  eyebrow?: string
  action?: ReactNode
  className?: string
  tone?: 'navy' | 'white'
  as?: 'h1' | 'h2' | 'h3'
}) {
  return (
    <div className={cn('mb-6 flex items-end justify-between gap-4', className)}>
      <div className="flex items-center gap-3">
        <span aria-hidden className={cn('h-7 w-1.5 rounded-full', tone === 'white' ? 'bg-brand-yellow' : 'bg-brand-blue')} />
        <div>
          {eyebrow && (
            <p className={cn('label-caps mb-1', tone === 'white' ? 'text-brand-yellow' : 'text-brand-blue')}>{eyebrow}</p>
          )}
          <Tag className={cn('text-h2', tone === 'white' && 'text-white')}>{title}</Tag>
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

export function ViewAllLink({ children, ...rest }: { children: ReactNode; href: string } & Record<string, unknown>) {
  return (
    <a
      className="label-caps inline-flex items-center gap-1.5 text-brand-blue hover:text-brand-navy"
      {...(rest as Record<string, string>)}
    >
      {children}
      <IconArrowRight size={16} />
    </a>
  )
}
