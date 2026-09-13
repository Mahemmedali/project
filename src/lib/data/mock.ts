/**
 * Mock məlumat mənbəyi — DATABASE_URI olmayanda (dizayn baxışı, CI) istifadə olunur.
 * Eyni imzalar `./payload.ts`-də Payload Local API ilə həyata keçirilir.
 */
import type { Locale } from '@/i18n/routing'
import { locales } from '@/i18n/routing'
import type {
  AdCampaign,
  AdSlot,
  AdSlotKey,
  Article,
  ArticleView,
  AuthorView,
  CategoryView,
  TagView,
  Weather,
  SiteSettings,
} from '@/lib/types'
import { articles } from '@/lib/mock/articles'
import { adCampaigns, adSlots, authors, categories, partners, tags, weather } from '@/lib/mock/taxonomy'

/* ---------- daxili köməkçilər ---------- */

function categoryView(id: string, locale: Locale): CategoryView {
  const c = categories.find((x) => x.id === id)
  if (!c) throw new Error(`Category not found: ${id}`)
  return { id: c.id, slug: c.slug[locale], name: c.name[locale], description: c.description[locale], color: c.color }
}

function authorView(id: string, locale: Locale): AuthorView {
  const a = authors.find((x) => x.id === id)
  if (!a) throw new Error(`Author not found: ${id}`)
  return { id: a.id, slug: a.slug, name: a.name, role: a.role[locale], bio: a.bio[locale], photo: a.photo, initials: a.initials, social: a.social }
}

function tagView(id: string, locale: Locale): TagView {
  const t = tags.find((x) => x.id === id)
  if (!t) throw new Error(`Tag not found: ${id}`)
  return { id: t.id, slug: t.slug[locale], name: t.name[locale] }
}

/** CMS ilə eyni qayda: başlıq + slug + mətn olmalıdır */
function isAvailable(a: Article, locale: Locale) {
  return a.status === 'published' && Boolean(a.title[locale] && a.slug[locale] && a.body[locale]?.length)
}

function toView(a: Article, locale: Locale): ArticleView {
  const alternates: ArticleView['alternates'] = {}
  for (const l of locales) {
    if (a.title[l] && a.slug[l]) {
      const c = categories.find((x) => x.id === a.categoryId)!
      alternates[l] = { category: c.slug[l], slug: a.slug[l]! }
    }
  }
  return {
    id: a.id,
    title: a.title[locale]!,
    slug: a.slug[locale]!,
    excerpt: a.excerpt[locale] ?? '',
    body: a.body[locale] ?? [],
    cover: { src: a.cover.src, alt: a.cover.alt[locale], credit: a.cover.credit },
    category: categoryView(a.categoryId, locale),
    authors: a.authorIds.map((id) => authorView(id, locale)),
    tags: a.tagIds.map((id) => tagView(id, locale)),
    publishedAt: a.publishedAt,
    updatedAt: a.updatedAt,
    isPremium: a.isPremium,
    isSponsored: a.isSponsored,
    sponsor: a.sponsorId ? partners.find((p) => p.id === a.sponsorId) : undefined,
    isBreaking: Boolean(a.isBreaking),
    isEditorsPick: Boolean(a.isEditorsPick),
    readingTime: a.readingTime,
    views: a.views,
    alternates,
  }
}

function published(locale: Locale) {
  return articles
    .filter((a) => isAvailable(a, locale))
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))
}

/* ---------- açıq API ---------- */

export async function getCategories(locale: Locale): Promise<CategoryView[]> {
  return [...categories].sort((a, b) => a.order - b.order).map((c) => categoryView(c.id, locale))
}

export async function getCategoryBySlug(locale: Locale, slug: string): Promise<CategoryView | null> {
  const c = categories.find((x) => x.slug[locale] === slug)
  return c ? categoryView(c.id, locale) : null
}

/** Kateqoriyanın digər dillərdəki slug-ları (hreflang / dil keçidi) */
export async function getCategoryAlternates(id: string): Promise<Record<Locale, string> | null> {
  const c = categories.find((x) => x.id === id)
  return c ? c.slug : null
}

export interface ArticleQuery {
  locale: Locale
  categoryId?: string
  tagId?: string
  authorId?: string
  excludeIds?: string[]
  limit?: number
  offset?: number
  q?: string
}

export async function getArticles(qy: ArticleQuery): Promise<{ items: ArticleView[]; total: number }> {
  let list = published(qy.locale)
  if (qy.categoryId) list = list.filter((a) => a.categoryId === qy.categoryId)
  if (qy.tagId) list = list.filter((a) => a.tagIds.includes(qy.tagId!))
  if (qy.authorId) list = list.filter((a) => a.authorIds.includes(qy.authorId!))
  if (qy.excludeIds?.length) list = list.filter((a) => !qy.excludeIds!.includes(a.id))
  if (qy.q) {
    const needle = qy.q.toLocaleLowerCase()
    list = list.filter((a) => {
      const hay = [a.title[qy.locale], a.excerpt[qy.locale], ...a.authorIds.map((id) => authors.find((x) => x.id === id)?.name)]
        .join(' ')
        .toLocaleLowerCase()
      return hay.includes(needle)
    })
  }
  const total = list.length
  const offset = qy.offset ?? 0
  const limit = qy.limit ?? 12
  return { items: list.slice(offset, offset + limit).map((a) => toView(a, qy.locale)), total }
}

export async function getArticleBySlug(locale: Locale, categorySlug: string, slug: string, opts?: { draft?: boolean }): Promise<ArticleView | null> {
  void opts // mock-da qaralama yoxdur
  const c = categories.find((x) => x.slug[locale] === categorySlug)
  if (!c) return null
  const a = articles.find((x) => x.categoryId === c.id && x.slug[locale] === slug && isAvailable(x, locale))
  return a ? toView(a, locale) : null
}

export async function getBreaking(locale: Locale): Promise<ArticleView[]> {
  return published(locale).filter((a) => a.isBreaking).slice(0, 3).map((a) => toView(a, locale))
}

export async function getMostRead(locale: Locale, limit = 5): Promise<ArticleView[]> {
  return [...published(locale)].sort((a, b) => b.views - a.views).slice(0, limit).map((a) => toView(a, locale))
}

export async function getEditorsPicks(locale: Locale, limit = 3): Promise<ArticleView[]> {
  return published(locale).filter((a) => a.isEditorsPick).slice(0, limit).map((a) => toView(a, locale))
}

export async function getRelated(locale: Locale, article: ArticleView, limit = 3): Promise<ArticleView[]> {
  const sameCat = published(locale).filter((a) => a.categoryId === article.category.id && a.id !== article.id)
  const others = published(locale).filter((a) => a.categoryId !== article.category.id && a.id !== article.id)
  return [...sameCat, ...others].slice(0, limit).map((a) => toView(a, locale))
}

export async function getAuthors(locale: Locale): Promise<AuthorView[]> {
  return authors.map((a) => authorView(a.id, locale))
}

export async function getAuthorBySlug(locale: Locale, slug: string): Promise<AuthorView | null> {
  const a = authors.find((x) => x.slug === slug)
  return a ? authorView(a.id, locale) : null
}

export async function getTagBySlug(locale: Locale, slug: string): Promise<TagView | null> {
  const t = tags.find((x) => x.slug[locale] === slug)
  return t ? tagView(t.id, locale) : null
}

export async function getTagAlternates(id: string): Promise<Record<Locale, string> | null> {
  const t = tags.find((x) => x.id === id)
  return t ? t.slug : null
}

export async function getPopularTags(locale: Locale, limit = 8): Promise<TagView[]> {
  const counts = new Map<string, number>()
  for (const a of published(locale)) for (const t of a.tagIds) counts.set(t, (counts.get(t) ?? 0) + 1)
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id]) => tagView(id, locale))
}

export async function getAd(slot: AdSlotKey, locale: Locale): Promise<{ slot: AdSlot; campaign: AdCampaign | null } | null> {
  const s = adSlots.find((x) => x.key === slot)
  if (!s || !s.active) return null
  const campaign = adCampaigns.find((c) => c.slot === slot && c.locales.includes(locale)) ?? null
  return { slot: s, campaign }
}

export async function getWeather(): Promise<Weather> {
  return weather
}

export async function getSiteSettings(locale: Locale): Promise<SiteSettings> {
  void locale
  return { tickerEnabled: true, social: [], contact: { editorialEmail: 'redaksiya@goodmorningbaku.com', salesEmail: 'reklam@goodmorningbaku.com' } }
}

export async function getAllArticleParams() {
  const out: { locale: Locale; category: string; slug: string }[] = []
  for (const l of locales) for (const a of published(l)) {
    const v = toView(a, l)
    out.push({ locale: l, category: v.category.slug, slug: v.slug })
  }
  return out
}
