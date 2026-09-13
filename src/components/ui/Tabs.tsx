'use client'

import { useId, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface TabItem {
  id: string
  label: string
  content: ReactNode
}

export function Tabs({ items, defaultId, className }: { items: TabItem[]; defaultId?: string; className?: string }) {
  const [active, setActive] = useState(defaultId ?? items[0]?.id)
  const baseId = useId()
  return (
    <div className={className}>
      <div role="tablist" className="flex gap-1 overflow-x-auto border-b border-brand-line">
        {items.map((it) => {
          const selected = it.id === active
          return (
            <button
              key={it.id}
              role="tab"
              id={`${baseId}-tab-${it.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${it.id}`}
              onClick={() => setActive(it.id)}
              className={cn(
                'label-caps -mb-px h-11 shrink-0 border-b-2 px-4 transition-colors',
                selected
                  ? 'border-brand-blue text-brand-blue'
                  : 'border-transparent text-brand-muted hover:text-brand-navy',
              )}
            >
              {it.label}
            </button>
          )
        })}
      </div>
      {items.map((it) => (
        <div
          key={it.id}
          role="tabpanel"
          id={`${baseId}-panel-${it.id}`}
          aria-labelledby={`${baseId}-tab-${it.id}`}
          hidden={it.id !== active}
          className="pt-6"
        >
          {it.content}
        </div>
      ))}
    </div>
  )
}
