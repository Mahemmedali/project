/**
 * Payload Local API məlumat mənbəyi. İmzalar `./mock.ts` ilə eynidir.
 */
import { getPayload, type Where } from 'payload'
import config from '@payload-config'
import type { Locale } from '@/i18n/routing'
import { locales } from '@/i18n/routing'
import type { AdCampaign, AdSlot, AdSlotKey, ArticleView, AuthorView, CategoryView, Partner, SiteSettings, TagView, Weather } from '@/lib/types'
import type { ArticleQuery } from './mock'
import type { Article, Author, Category, Media, Partner as PartnerDoc, Tag } from '@/payload-types'
import { lexicalToBlocks } from '@/lib/lexical'

const db = () => getPayload({ config })
const FALLBACK_COVER = '/mock/cover-01.svg'

/* ---------- köməkçilər ---------- */

type Loc<T> = Partial<Record<Locale, T>>
const pick = <T,>(v: T | Loc<T> | null | undefined, locale: Locale): T | undefined => {
  if (v == null) return undefined
  if (typeof v === 'object' && !Array.isArray(v) && (('az' in v) || ('en' in v) || ('ru' in v))) return (v as Loc<T>)[locale]
  return v as T
}

/** Lokal saxlama: `/api/media/file/x.jpg` → `/media/x.jpg` (statik, sürətli); R2: tam URL olduğu kimi qalır */
function normalizeUrl(u: string | null | undefined): string | undefined {
  if (!u) return undefined
  const path = u.replace(/^https?:\/\/[^/]+/, '')
  if (path.startsWith('/api/media/file/')) return '/media/' + path.slice('/api/media/file/'.length)
  return u
}

function mediaUrl(m: Media | number | null | undefined, size?: 'thumb' | 'card' | 'hero' | 'og'): string {
  if (!m || typeof m !== 'object') return FALLBACK_COVER
  const s = size ? normalizeUrl(m.sizes?.[size]?.url) : undefined
  return s || normalizeUrl(m.url) || FALLBACK_COVER
}

function categoryView(c: Category | number | null | undefined, locale: Locale): CategoryView {
  if (!c || typeof c !== 'object') return { id: String(c ?? ''), slug: '', name: '', description: '', color: 'blue' }
  return {
    id: String(c.id),
    slug: pick(c.slug, locale) ?? '',
    name: pick(c.name, locale) ?? '',
    description: pick(c.description, locale) ?? '',
    color: (c.color as CategoryView['color']) ?? 'blue',
  }
}

function authorView(a: Author, locale: Locale): AuthorView {
  const name = a.name ?? ''
  return {
    id: String(a.id),
    slug: a.slug,
    name,
    role: pick(a.role, locale) ?? '',
    bio: pick(a.bio, locale) ?? '',
    photo: a.photo && typeof a.photo === 'object' ? mediaUrl(a.photo, 'thumb') : undefined,
    initials: name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase(),
    social: a.social ? { x: a.social.x ?? undefined, linkedin: a.social.linkedin ?? undefined, instagram: a.social.instagram ?? undefined } : undefined,
  }
}

function tagView(t: Tag, locale: Locale): TagView {
  return { id: String(t.id), slug: pick(t.slug, locale) ?? '', name: pick(t.name, locale) ?? '' }
}

function partnerView(p: PartnerDoc | number | null | undefined): Partner | undefined {
  if (!p || typeof p !== 'object') return undefined
  return { id: String(p.id), name: p.name, website: p.website ?? '', type: p.type, logo: p.logo && typeof p.logo === 'object' ? normalizeUrl(p.logo.url) : undefined }
}

function toView(a: Article, locale: Locale, alternates: ArticleView['alternates'] = {}): ArticleView {
  const cat = categoryView(a.category, locale)
  const cover = a.cover && typeof a.cover === 'object' ? a.cover : null
  return {
    id: String(a.id),
    title: pick(a.title, locale) ?? '',
    slug: pick(a.slug, locale) ?? '',
    excerpt: pick(a.excerpt, locale) ?? '',
    body: lexicalToBlocks(pick(a.body, locale)),
    cover: { src: mediaUrl(cover, 'hero'), alt: pick(cover?.alt, locale) ?? '', credit: cover?.credit ?? undefined },
    category: cat,
    authors: (a.authors ?? []).filter((x): x is Author => typeof x === 'object').map((x) => authorView(x, locale)),
    tags: (a.tags ?? []).filter((x): x is Tag => typeof x === 'object').map((x) => tagView(x, locale)),
    publishedAt: a.publishedAt,
    updatedAt: +new Date(a.updatedAt) - +new Date(a.publishedAt) > 3600_000 ? a.updatedAt : undefined,
    isPremium: Boolean(a.isPremium),
    isSponsored: Boolean(a.isSponsored),
    sponsor: a.isSponsored ? partnerView(a.sponsor) : undefined,
    isBreaking: Boolean(a.isBreaking),
    isEditorsPick: Boolean(a.isEditorsPick),
    readingTime: a.readingTime ?? 1,
    views: a.views ?? 0,
    alternates: Object.keys(alternates).length ? alternates : { [locale]: { category: cat.slug, slug: pick(a.slug, locale) ?? '' } },
  }
}

const publishedWhere = (): Where => ({ and: [{ _status: { equals: 'published' } }, { title: { exists: true } }, { slug: { exists: true } }] })

/* ---------- kateqoriyalar ---------- */

export async function getCategories(locale: Locale): Promise<CategoryView[]> {
  const r = await (await db()).find({ collection: 'categories', locale, fallbackLocale: false, sort: 'order', limit: 50, depth: 0 })
  return r.docs.filter((c) => c.name && c.slug).map((c) => categoryView(c, locale))
}

export async function getCategoryBySlug(locale: Locale, slug: string): Promise<CategoryView | null> {
  const r = await (await db()).find({ collection: 'categories', locale, fallbackLocale: false, where: { slug: { equals: slug } }, limit: 1, depth: 0 })
  return r.docs[0] ? categoryView(r.docs[0], locale) : null
}

export async function getCategoryAlternates(id: string): Promise<Record<Locale, string> | null> {
  const c = (await (await db()).findByID({ collection: 'categories', id, locale: 'all', depth: 0 })) as unknown as { slug: Loc<string> } | null
  if (!c) return null
  const out = {} as Record<Locale, string>
  for (const l of locales) if (c.slug?.[l]) out[l] = c.slug[l]!
  return out
}

/* ---------- məqalələr ---------- */

export type { ArticleQuery }

export async function getArticles(qy: ArticleQuery): Promise<{ items: ArticleView[]; total: number }> {
  const and: Where[] = [publishedWhere()]
  if (qy.categoryId) and.push({ category: { equals: qy.categoryId } })
  if (qy.tagId) and.push({ tags: { contains: qy.tagId } })
  if (qy.authorId) and.push({ authors: { contains: qy.authorId } })
  if (qy.excludeIds?.length) and.push({ id: { not_in: qy.excludeIds } })
  if (qy.q) and.push({ or: [{ title: { like: qy.q } }, { excerpt: { like: qy.q } }] })
  const limit = qy.limit ?? 12
  const page = Math.floor((qy.offset ?? 0) / limit) + 1
  const r = await (await db()).find({ collection: 'articles', locale: qy.locale, fallbackLocale: false, where: { and }, sort: '-publishedAt', limit, page, depth: 1 })
  return { items: r.docs.map((a) => toView(a, qy.locale)), total: r.totalDocs }
}

async function alternatesFor(id: string | number): Promise<ArticleView['alternates']> {
  const a = (await (await db()).findByID({ collection: 'articles', id, locale: 'all', depth: 1, select: { slug: true, title: true, category: true } })) as unknown as {
    slug?: Loc<string>
    title?: Loc<string>
    category?: { slug?: Loc<string> } | number
  } | null
  const out: ArticleView['alternates'] = {}
  if (!a) return out
  const cat = typeof a.category === 'object' ? a.category : null
  for (const l of locales) {
    const s = a.slug?.[l]
    const c = cat?.slug?.[l]
    if (s && c && a.title?.[l]) out[l] = { category: c, slug: s }
  }
  return out
}

export async function getArticleBySlug(locale: Locale, categorySlug: string, slug: string, opts?: { draft?: boolean }): Promise<ArticleView | null> {
  const p = await db()
  const where: Where = opts?.draft
    ? { and: [{ slug: { equals: slug } }, { 'category.slug': { equals: categorySlug } }] }
    : { and: [publishedWhere(), { slug: { equals: slug } }, { 'category.slug': { equals: categorySlug } }] }
  const r = await p.find({ collection: 'articles', locale, fallbackLocale: false, where, limit: 1, depth: 2, draft: Boolean(opts?.draft), overrideAccess: true })
  const a = r.docs[0]
  if (!a) return null
  return toView(a, locale, await alternatesFor(a.id))
}

export async function getBreaking(locale: Locale): Promise<ArticleView[]> {
  const r = await (await db()).find({ collection: 'articles', locale, fallbackLocale: false, where: { and: [publishedWhere(), { isBreaking: { equals: true } }] }, sort: '-publishedAt', limit: 3, depth: 1 })
  return r.docs.map((a) => toView(a, locale))
}

export async function getMostRead(locale: Locale, limit = 5): Promise<ArticleView[]> {
  const r = await (await db()).find({ collection: 'articles', locale, fallbackLocale: false, where: publishedWhere(), sort: '-views', limit, depth: 1 })
  return r.docs.map((a) => toView(a, locale))
}

export async function getEditorsPicks(locale: Locale, limit = 3): Promise<ArticleView[]> {
  const r = await (await db()).find({ collection: 'articles', locale, fallbackLocale: false, where: { and: [publishedWhere(), { isEditorsPick: { equals: true } }] }, sort: '-publishedAt', limit, depth: 1 })
  return r.docs.map((a) => toView(a, locale))
}

export async function getRelated(locale: Locale, article: ArticleView, limit = 3): Promise<ArticleView[]> {
  const same = await getArticles({ locale, categoryId: article.category.id, excludeIds: [article.id], limit })
  if (same.items.length >= limit) return same.items
  const rest = await getArticles({ locale, excludeIds: [article.id, ...same.items.map((x) => x.id)], limit: limit - same.items.length })
  return [...same.items, ...rest.items]
}

/* ---------- müəlliflər / teqlər ---------- */

export async function getAuthors(locale: Locale): Promise<AuthorView[]> {
  const r = await (await db()).find({ collection: 'authors', locale, fallbackLocale: false, sort: 'name', limit: 100, depth: 1 })
  return r.docs.map((a) => authorView(a, locale))
}

export async function getAuthorBySlug(locale: Locale, slug: string): Promise<AuthorView | null> {
  const r = await (await db()).find({ collection: 'authors', locale, fallbackLocale: false, where: { slug: { equals: slug } }, limit: 1, depth: 1 })
  return r.docs[0] ? authorView(r.docs[0], locale) : null
}

export async function getTagBySlug(locale: Locale, slug: string): Promise<TagView | null> {
  const r = await (await db()).find({ collection: 'tags', locale, fallbackLocale: false, where: { slug: { equals: slug } }, limit: 1, depth: 0 })
  return r.docs[0] ? tagView(r.docs[0], locale) : null
}

export async function getTagAlternates(id: string): Promise<Record<Locale, string> | null> {
  const t = (await (await db()).findByID({ collection: 'tags', id, locale: 'all', depth: 0 })) as unknown as { slug: Loc<string> } | null
  if (!t) return null
  const out = {} as Record<Locale, string>
  for (const l of locales) if (t.slug?.[l]) out[l] = t.slug[l]!
  return out
}

export async function getPopularTags(locale: Locale, limit = 8): Promise<TagView[]> {
  const p = await db()
  const arts = await p.find({ collection: 'articles', locale, fallbackLocale: false, where: publishedWhere(), sort: '-publishedAt', limit: 200, depth: 0, select: { tags: true } })
  const counts = new Map<number, number>()
  for (const a of arts.docs) for (const t of a.tags ?? []) {
    const id = typeof t === 'object' ? t.id : t
    counts.set(id, (counts.get(id) ?? 0) + 1)
  }
  const ids = [...counts.entries()].sort((x, y) => y[1] - x[1]).slice(0, limit).map(([id]) => id)
  if (!ids.length) return []
  const tags = await p.find({ collection: 'tags', locale, fallbackLocale: false, where: { id: { in: ids } }, limit, depth: 0 })
  return ids.map((id) => tags.docs.find((t) => t.id === id)).filter((t): t is Tag => Boolean(t?.name)).map((t) => tagView(t, locale))
}

/* ---------- reklam ---------- */

export async function getAd(slot: AdSlotKey, locale: Locale): Promise<{ slot: AdSlot; campaign: AdCampaign | null } | null> {
  const p = await db()
  const s = (await p.find({ collection: 'ad-slots', where: { key: { equals: slot } }, limit: 1, depth: 0 })).docs[0]
  if (!s || !s.active) return null
  const now = new Date().toISOString()
  const c = (
    await p.find({
      collection: 'ad-campaigns',
      where: {
        and: [
          { slot: { equals: s.id } },
          { active: { equals: true } },
          { targetLocales: { contains: locale } },
          { or: [{ startAt: { exists: false } }, { startAt: { less_than_equal: now } }] },
          { or: [{ endAt: { exists: false } }, { endAt: { greater_than_equal: now } }] },
        ],
      },
      sort: '-createdAt',
      limit: 1,
      depth: 1,
    })
  ).docs[0]
  const slotView: AdSlot = {
    key: s.key as AdSlotKey,
    size: { w: s.size.w, h: s.size.h },
    mobileSize: s.mobileSize?.w && s.mobileSize?.h ? { w: s.mobileSize.w, h: s.mobileSize.h } : undefined,
    active: Boolean(s.active),
  }
  if (!c) return { slot: slotView, campaign: null }
  const creative = c.creative && typeof c.creative === 'object' ? c.creative : null
  return {
    slot: slotView,
    campaign: {
      id: String(c.id),
      partnerId: String(typeof c.partner === 'object' ? c.partner.id : c.partner),
      slot: slotView.key,
      creative: c.creativeType === 'image' && creative ? { src: normalizeUrl(creative.url) ?? '', alt: pick(creative.alt, locale) ?? c.name, w: creative.width ?? undefined, h: creative.height ?? undefined } : undefined,
      html: c.creativeType === 'html' ? c.html ?? undefined : undefined,
      url: c.url,
      locales: (c.targetLocales ?? []) as Locale[],
    },
  }
}

/* ---------- parametrlər ---------- */

export async function getWeather(): Promise<Weather> {
  const s = (await (await db()).findGlobal({ slug: 'settings', locale: 'all', depth: 0 })) as unknown as {
    weather?: { city?: Loc<string>; tempDay?: number; tempNight?: number; condition?: Loc<string>; icon?: Weather['icon'] }
  }
  const w = s.weather
  const loc = (v: Loc<string> | undefined, fb: Record<Locale, string>) => ({ az: v?.az ?? fb.az, en: v?.en ?? fb.en, ru: v?.ru ?? fb.ru })
  return {
    city: loc(w?.city, { az: 'Bakı', en: 'Baku', ru: 'Баку' }),
    tempDay: w?.tempDay ?? 25,
    tempNight: w?.tempNight ?? 18,
    condition: loc(w?.condition, { az: '', en: '', ru: '' }),
    icon: w?.icon ?? 'sun',
  }
}

export async function getSiteSettings(locale: Locale): Promise<SiteSettings> {
  const s = await (await db()).findGlobal({ slug: 'settings', locale, fallbackLocale: false, depth: 0 })
  return {
    tickerEnabled: s.tickerEnabled !== false,
    social: (s.social ?? []).map((x) => ({ network: x.network, url: x.url })),
    contact: {
      editorialEmail: s.contact?.editorialEmail ?? undefined,
      salesEmail: s.contact?.salesEmail ?? undefined,
      phone: s.contact?.phone ?? undefined,
      address: s.contact?.address ?? undefined,
    },
  }
}

/* ---------- build ---------- */

export async function getAllArticleParams() {
  const r = (await (await db()).find({ collection: 'articles', locale: 'all', where: { _status: { equals: 'published' } }, limit: 2000, depth: 1, select: { slug: true, title: true, category: true } })) as unknown as {
    docs: { slug?: Loc<string>; title?: Loc<string>; category?: { slug?: Loc<string> } | number }[]
  }
  const out: { locale: Locale; category: string; slug: string }[] = []
  for (const a of r.docs) {
    const cat = typeof a.category === 'object' ? a.category : null
    for (const l of locales) {
      const s = a.slug?.[l]
      const c = cat?.slug?.[l]
      if (s && c && a.title?.[l]) out.push({ locale: l, category: c, slug: s })
    }
  }
  return out
}
