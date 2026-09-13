import type { CollectionBeforeChangeHook } from 'payload'
import { hasRole } from '@/access'

/** Lexical JSON-dan söz sayı → oxu vaxtı (dəq), ~200 söz/dəq */
function countWords(node: unknown): number {
  if (!node || typeof node !== 'object') return 0
  const n = node as { text?: string; children?: unknown[] }
  let c = 0
  if (typeof n.text === 'string') c += n.text.trim().split(/\s+/).filter(Boolean).length
  if (Array.isArray(n.children)) for (const ch of n.children) c += countWords(ch)
  return c
}

export const computeReadingTime: CollectionBeforeChangeHook = ({ data }) => {
  const body = data?.body as { root?: unknown } | undefined
  if (body?.root) {
    const words = countWords(body.root)
    data.readingTime = Math.max(1, Math.round(words / 200))
  }
  return data
}

export const setCreatedBy: CollectionBeforeChangeHook = ({ data, req, operation }) => {
  if (operation === 'create' && req.user && !data.createdBy) data.createdBy = req.user.id
  return data
}

/** `author` rolu dərc edə bilmir — həmişə qaralama kimi saxlanır */
export const authorCannotPublish: CollectionBeforeChangeHook = ({ data, req }) => {
  if (req.user && hasRole(req.user, 'author') && !hasRole(req.user, 'admin', 'editor')) {
    data._status = 'draft'
  }
  return data
}
