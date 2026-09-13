import type { Locale } from '@/i18n/routing'

/** Bütün dillərdə mövcud olan dəyər */
export type Localized<T = string> = Record<Locale, T>
/** Bəzi dillərdə boş qala bilən dəyər (tərcümə edilməyib) */
export type PartialLocalized<T = string> = Partial<Record<Locale, T>>

export type CategoryColor = 'blue' | 'navy' | 'gold' | 'yellow'

export interface Category {
  id: string
  order: number
  color: CategoryColor
  slug: Localized
  name: Localized
  description: Localized
}

export interface Tag {
  id: string
  slug: Localized
  name: Localized
}

export interface Author {
  id: string
  slug: string
  name: string
  role: Localized
  bio: Localized
  photo?: string
  initials: string
  social?: { x?: string; linkedin?: string; instagram?: string }
}

export interface Partner {
  id: string
  name: string
  logo?: string
  website: string
  type: 'advertiser' | 'sponsor'
}

export type RichBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'quote'; text: string; cite?: string }
  | { type: 'list'; ordered?: boolean; items: string[] }
  | { type: 'image'; src: string; alt: string; caption?: string; credit?: string }

export interface Article {
  id: string
  categoryId: string
  authorIds: string[]
  tagIds: string[]
  status: 'draft' | 'published'
  publishedAt: string
  updatedAt?: string
  isPremium: boolean
  isSponsored: boolean
  sponsorId?: string
  isBreaking?: boolean
  isEditorsPick?: boolean
  views: number
  readingTime: number
  cover: { src: string; alt: Localized; credit?: string }
  title: PartialLocalized
  slug: PartialLocalized
  excerpt: PartialLocalized
  body: PartialLocalized<RichBlock[]>
}

export type AdSlotKey =
  | 'home_top'
  | 'home_inline'
  | 'sidebar'
  | 'article_inline'
  | 'article_bottom'
  | 'category_top'

export interface AdSlot {
  key: AdSlotKey
  size: { w: number; h: number }
  mobileSize?: { w: number; h: number }
  active: boolean
}

export interface AdCampaign {
  id: string
  partnerId: string
  slot: AdSlotKey
  creative: { src: string; alt: string }
  url: string
  locales: Locale[]
}

export interface Weather {
  city: Localized
  tempDay: number
  tempNight: number
  condition: Localized
  icon: 'sun' | 'cloud' | 'rain' | 'wind'
}

/* ---------- Lokala görə həll olunmuş "view" tipləri (UI bunlarla işləyir) ---------- */

export interface CategoryView {
  id: string
  slug: string
  name: string
  description: string
  color: CategoryColor
}

export interface AuthorView {
  id: string
  slug: string
  name: string
  role: string
  bio: string
  photo?: string
  initials: string
  social?: Author['social']
}

export interface TagView {
  id: string
  slug: string
  name: string
}

export interface ArticleView {
  id: string
  title: string
  slug: string
  excerpt: string
  body: RichBlock[]
  cover: { src: string; alt: string; credit?: string }
  category: CategoryView
  authors: AuthorView[]
  tags: TagView[]
  publishedAt: string
  updatedAt?: string
  isPremium: boolean
  isSponsored: boolean
  sponsor?: Partner
  isBreaking: boolean
  isEditorsPick: boolean
  readingTime: number
  views: number
  /** Digər dillərdəki ünvanlar (hreflang + dil keçidi). Tərcümə yoxdursa — yoxdur. */
  alternates: PartialLocalized<{ category: string; slug: string }>
}
