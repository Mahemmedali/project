import { describe, expect, it } from 'vitest'
import { blocksToLexical, lexicalToBlocks } from '@/lib/lexical'
import type { RichBlock } from '@/lib/types'

describe('lexical ↔ RichBlock', () => {
  const blocks: RichBlock[] = [
    { type: 'paragraph', text: 'Salam, Bakı.' },
    { type: 'heading', level: 2, text: 'Nə dəyişəcək?' },
    { type: 'list', items: ['Bir', 'İki'] },
    { type: 'quote', text: 'Sitat' },
  ]

  it('round-trip mətn və strukturu qoruyur', () => {
    const out = lexicalToBlocks(blocksToLexical(blocks))
    expect(out).toHaveLength(4)
    expect(out[0]).toMatchObject({ type: 'paragraph', runs: [{ text: 'Salam, Bakı.' }] })
    expect(out[1]).toMatchObject({ type: 'heading', level: 2, text: 'Nə dəyişəcək?' })
    expect(out[2]).toMatchObject({ type: 'list', ordered: false })
    expect(out[3]).toMatchObject({ type: 'quote', text: 'Sitat' })
  })

  it('bold/italic/link run-larını çıxarır', () => {
    const lex = {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              { type: 'text', text: 'Adi ', format: 0 },
              { type: 'text', text: 'qalın', format: 1 },
              { type: 'link', fields: { url: 'https://example.com', newTab: true }, children: [{ type: 'text', text: ' keçid', format: 2 }] },
            ],
          },
        ],
      },
    }
    const [p] = lexicalToBlocks(lex)
    expect(p.type).toBe('paragraph')
    if (p.type !== 'paragraph') return
    expect(p.runs).toEqual([
      { text: 'Adi ', bold: false, italic: false, code: false },
      { text: 'qalın', bold: true, italic: false, code: false },
      { text: ' keçid', bold: false, italic: true, code: false, link: 'https://example.com', newTab: true },
    ])
  })

  it('boş və yanlış girişdə boş massiv qaytarır', () => {
    expect(lexicalToBlocks(null)).toEqual([])
    expect(lexicalToBlocks({ root: { type: 'root', children: [{ type: 'paragraph', children: [{ type: 'text', text: '   ' }] }] } })).toEqual([])
  })
})
