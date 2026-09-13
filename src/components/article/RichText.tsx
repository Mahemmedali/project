import Image from 'next/image'
import type { Inline, RichBlock, Run } from '@/lib/types'
import { cn } from '@/lib/utils'

/**
 * Zəngin mətn render — RichBlock modeli (mock) və Lexical JSON (CMS, `lexicalToBlocks` ilə) üçün eyni komponent.
 */
function renderRuns(rs: Run[]) {
  return rs.map((r, i) => {
    let node: React.ReactNode = r.text
    if (r.text === '\n') return <br key={i} />
    if (r.code) node = <code key={`c${i}`} className="rounded bg-brand-tint px-1 font-mono text-[0.9em]">{node}</code>
    if (r.bold) node = <strong key={`b${i}`}>{node}</strong>
    if (r.italic) node = <em key={`i${i}`}>{node}</em>
    if (r.link) {
      const ext = /^https?:\/\//.test(r.link)
      node = (
        <a key={`a${i}`} href={r.link} target={r.newTab || ext ? '_blank' : undefined} rel={ext ? 'noopener' : undefined}>
          {node}
        </a>
      )
    }
    return <span key={i}>{node}</span>
  })
}

function renderInline(inl: Inline | undefined) {
  if (inl == null) return null
  return typeof inl === 'string' ? inl : renderRuns(inl)
}

export function RichText({ blocks, className }: { blocks: RichBlock[]; className?: string }) {
  return (
    <div className={cn('prose-gmb', className)}>
      {blocks.map((b, i) => {
        switch (b.type) {
          case 'paragraph':
            return <p key={i}>{renderInline(b.runs ?? b.text)}</p>
          case 'heading':
            return b.level === 2 ? <h2 key={i}>{renderInline(b.runs ?? b.text)}</h2> : <h3 key={i}>{renderInline(b.runs ?? b.text)}</h3>
          case 'quote':
            return (
              <blockquote key={i}>
                <p>{b.text}</p>
                {b.cite && <footer className="mt-2 font-body text-caption text-brand-muted not-italic">— {b.cite}</footer>}
              </blockquote>
            )
          case 'list':
            return b.ordered ? (
              <ol key={i}>{b.items.map((it, j) => <li key={j}>{renderInline(it)}</li>)}</ol>
            ) : (
              <ul key={i}>{b.items.map((it, j) => <li key={j}>{renderInline(it)}</li>)}</ul>
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
