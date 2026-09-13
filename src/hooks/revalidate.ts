import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'
import { locales } from '@/i18n/routing'

/**
 * Dərc / dəyişiklik → ISR keşini təmizlə.
 * Seed və miqrasiya zamanı `context.disableRevalidate = true` ilə söndürülür.
 */
async function revalidate(paths: string[], tags: string[] = []) {
  try {
    const { revalidatePath, revalidateTag } = await import('next/cache')
    for (const p of paths) revalidatePath(p)
    for (const t of tags) revalidateTag(t)
  } catch {
    // Next.js kontekstindən kənarda (seed skripti) — sükutla keç
  }
}

function localePaths(sub: (l: string) => string | null) {
  return locales.flatMap((l) => {
    const s = sub(l)
    return s == null ? [] : [`/${l}${s}`]
  })
}

export const revalidateArticle: CollectionAfterChangeHook = async ({ doc, previousDoc, req }) => {
  if (req.context?.disableRevalidate) return doc
  const paths = ['/', ...localePaths(() => '')]
  const cat = typeof doc.category === 'object' ? doc.category : null
  for (const d of [doc, previousDoc]) {
    if (!d) continue
    const slugs = typeof d.slug === 'object' ? d.slug : null
    for (const l of locales) {
      const catSlug = cat?.slug && typeof cat.slug === 'object' ? cat.slug[l] : cat?.slug
      const slug = slugs ? slugs[l] : d.slug
      if (catSlug) paths.push(`/${l}/${catSlug}`)
      if (catSlug && slug) paths.push(`/${l}/${catSlug}/${slug}`)
    }
  }
  await revalidate(paths, ['articles'])
  return doc
}

export const revalidateArticleDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
  if (req.context?.disableRevalidate) return doc
  await revalidate(['/', ...localePaths(() => '')], ['articles'])
  return doc
}

/** Kateqoriya / teq / müəllif / parametrlər dəyişəndə bütün saytı yenilə */
export const revalidateAll: CollectionAfterChangeHook = async ({ doc, req }) => {
  if (req.context?.disableRevalidate) return doc
  await revalidate(['/'], ['articles', 'taxonomy'])
  try {
    const { revalidatePath } = await import('next/cache')
    revalidatePath('/', 'layout')
  } catch {}
  return doc
}

export const revalidateSettings: GlobalAfterChangeHook = async ({ doc, req }) => {
  if (req.context?.disableRevalidate) return doc
  try {
    const { revalidatePath } = await import('next/cache')
    revalidatePath('/', 'layout')
  } catch {}
  return doc
}
