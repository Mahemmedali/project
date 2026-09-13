import Image from 'next/image'
import type { RichBlock } from '@/lib/types'
import { cn } from '@/lib/utils'

/**
 * Zəngin mətn render — Mərhələ 1-də sadə blok modeli.
 * Mərhələ 2-də Payload Lexical JSON → eyni komponent, `@payloadcms/richtext-lexical/react` ilə.
 */
export function RichText({ blocks, className }: { blocks: RichBlock[]; className?: string }) {
  return (
    <div className={cn('prose-gmb', className)}>
      {blocks.map((b, i) => {
        switch (b.type) {
          case 'paragraph':
            return <p key={i}>{b.text}</p>
          case 'heading':
            return b.level === 2 ? <h2 key={i}>{b.text}</h2> : <h3 key={i}>{b.text}</h3>
          case 'quote':
            return (
              <blockquote key={i}>
                <p>{b.text}</p>
                {b.cite && <footer className="mt-2 font-body text-caption text-brand-muted not-italic">— {b.cite}</footer>}
              </blockquote>
            )
          case 'list':
            return b.ordered ? (
              <ol key={i}>{b.items.map((it, j) => <li key={j}>{it}</li>)}</ol>
            ) : (
              <ul key={i}>{b.items.map((it, j) => <li key={j}>{it}</li>)}</ul>
            )
          case 'image':
            return (
              <figure key={i}>
                <div className="relative aspect-[16/9] overflow-hidden rounded-card bg-brand-tint">
                  <Image src={b.src} alt={b.alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 720px" />
                </div>
                {(b.caption || b.credit) && (
                  <figcaption>
                    {b.caption} {b.credit && <span className="text-brand-faint">· {b.credit}</span>}
                  </figcaption>
                )}
              </figure>
            )
        }
      })}
    </div>
  )
}
