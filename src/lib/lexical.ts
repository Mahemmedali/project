import type { Inline, RichBlock, Run } from '@/lib/types'

/**
 * Payload Lexical JSON → RichBlock[] (UI komponenti dəyişmir).
 * Dəstəklənən: paragraph, heading(h2/h3), quote, list, upload; inline: bold/italic/link.
 */
type LexNode = {
  type: string
  text?: string
  format?: number | string
  tag?: string
  listType?: string
  children?: LexNode[]
  fields?: { url?: string; newTab?: boolean; linkType?: string; doc?: { value?: unknown } }
  value?: { url?: string; alt?: string; credit?: string; sizes?: Record<string, { url?: string }> } | number
}

function runs(nodes: LexNode[] = []): Run[] {
  const out: Run[] = []
  for (const n of nodes) {
    if (n.type === 'text' && typeof n.text === 'string') {
      const f = typeof n.format === 'number' ? n.format : 0
      out.push({ text: n.text, bold: Boolean(f & 1), italic: Boolean(f & 2), code: Boolean(f & 16) })
    } else if (n.type === 'linebreak') {
      out.push({ text: '\n' })
    } else if (n.type === 'link' || n.type === 'autolink') {
      const href = n.fields?.url ?? '#'
      for (const r of runs(n.children)) out.push({ ...r, link: href, newTab: n.fields?.newTab })
    } else if (n.children) {
      out.push(...runs(n.children))
    }
  }
  return out
}

const plain = (nodes?: LexNode[]) => runs(nodes).map((r) => r.text).join('')

export function lexicalToBlocks(data: unknown): RichBlock[] {
  const root = (data as { root?: LexNode } | null)?.root
  if (!root?.children) return []
  const blocks: RichBlock[] = []
  for (const n of root.children) {
    switch (n.type) {
      case 'paragraph': {
        const r = runs(n.children)
        if (r.some((x) => x.text.trim())) blocks.push({ type: 'paragraph', runs: r })
        break
      }
      case 'heading': {
        const level = n.tag === 'h3' || n.tag === 'h4' ? 3 : 2
        blocks.push({ type: 'heading', level, text: plain(n.children) })
        break
      }
      case 'quote':
        blocks.push({ type: 'quote', text: plain(n.children) })
        break
      case 'list':
        blocks.push({
          type: 'list',
          ordered: n.listType === 'number',
          items: (n.children ?? []).map((li) => runs(li.children) as Inline),
        })
        break
      case 'upload': {
        const v = typeof n.value === 'object' ? n.value : null
        if (v?.url) blocks.push({ type: 'image', src: v.url.replace(/^https?:\/\/[^/]+\/api\/media\/file\//, '/media/'), alt: v.alt ?? '', credit: v.credit })
        break
      }
      default:
        break
    }
  }
  return blocks
}

/** RichBlock[] → Lexical JSON (seed və miqrasiya üçün) */
export function blocksToLexical(blocks: RichBlock[]) {
  const base = { format: '' as const, indent: 0, version: 1, direction: 'ltr' as const }
  const text = (t: string) => ({ type: 'text', text: t, format: 0, style: '', mode: 'normal', detail: 0, version: 1 })
  const inlineNodes = (inl: Inline) =>
    typeof inl === 'string' ? [text(inl)] : inl.map((r) => ({ ...text(r.text), format: (r.bold ? 1 : 0) | (r.italic ? 2 : 0) }))
  const children = blocks.map((b) => {
    switch (b.type) {
      case 'paragraph':
        return { type: 'paragraph', ...base, textFormat: 0, textStyle: '', children: inlineNodes(b.runs ?? b.text ?? '') }
      case 'heading':
        return { type: 'heading', tag: `h${b.level}`, ...base, children: inlineNodes(b.runs ?? b.text ?? '') }
      case 'quote':
        return { type: 'quote', ...base, children: [text(b.text)] }
      case 'list':
        return {
          type: 'list',
          listType: b.ordered ? 'number' : 'bullet',
          tag: b.ordered ? 'ol' : 'ul',
          start: 1,
          ...base,
          children: b.items.map((it, i) => ({ type: 'listitem', value: i + 1, ...base, children: inlineNodes(it) })),
        }
      case 'image':
        return { type: 'paragraph', ...base, textFormat: 0, textStyle: '', children: [text(b.alt)] }
    }
  })
  return { root: { type: 'root', ...base, children } }
}
