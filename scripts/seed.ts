/**
 * İlkin məzmun: `pnpm seed`
 * - admin istifadəçi (SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD)
 * - kateqoriyalar, teqlər, müəlliflər, tərəfdaşlar, reklam slotları, media, məqalələr (3 dil), parametrlər
 * Artıq məzmun varsa (kateqoriya sayı > 0) heç nə etmir.
 */
import path from 'path'
import { getPayload, type Payload } from 'payload'
import config from '@payload-config'
import { locales, type Locale } from '../src/i18n/routing'
import { articles } from '../src/lib/mock/articles'
import { adSlots, authors, categories, partners, tags, weather } from '../src/lib/mock/taxonomy'
import { blocksToLexical } from '../src/lib/lexical'

const ctx = { disableRevalidate: true }
const other = locales.filter((l) => l !== 'az') as Locale[]

async function localized<T extends { id: number | string }>(
  payload: Payload,
  collection: 'categories' | 'tags' | 'authors' | 'articles',
  az: Record<string, unknown>,
  perLocale: (l: Locale) => Record<string, unknown> | null,
): Promise<T> {
  const doc = (await payload.create({ collection, data: az as never, locale: 'az', context: ctx, overrideAccess: true })) as unknown as T
  for (const l of other) {
    const data = perLocale(l)
    if (data) await payload.update({ collection, id: doc.id, data: data as never, locale: l, context: ctx, overrideAccess: true })
  }
  return doc
}

async function main() {
  const payload = await getPayload({ config })

  const existing = await payload.count({ collection: 'categories' })
  if (existing.totalDocs > 0) {
    console.log('Seed: məzmun artıq var, keçilir.')
    process.exit(0)
  }

  // Admin
  const email = process.env.SEED_ADMIN_EMAIL ?? 'admin@goodmorningbaku.com'
  const password = process.env.SEED_ADMIN_PASSWORD ?? 'Admin12345!'
  const users = await payload.count({ collection: 'users' })
  if (users.totalDocs === 0) {
    await payload.create({ collection: 'users', data: { email, password, name: 'Admin', roles: ['admin'] }, overrideAccess: true })
    console.log(`Admin yaradıldı: ${email}`)
  }

  // Kateqoriyalar
  const catIds = new Map<string, number>()
  for (const c of categories) {
    const doc = await localized<{ id: number }>(
      payload, 'categories',
      { name: c.name.az, slug: c.slug.az, description: c.description.az, color: c.color, order: c.order },
      (l) => ({ name: c.name[l], slug: c.slug[l], description: c.description[l] }),
    )
    catIds.set(c.id, doc.id)
  }
  console.log(`Kateqoriyalar: ${catIds.size}`)

  // Teqlər
  const tagIds = new Map<string, number>()
  for (const t of tags) {
    const doc = await localized<{ id: number }>(payload, 'tags', { name: t.name.az, slug: t.slug.az }, (l) => ({ name: t.name[l], slug: t.slug[l] }))
    tagIds.set(t.id, doc.id)
  }
  console.log(`Teqlər: ${tagIds.size}`)

  // Müəlliflər
  const authorIds = new Map<string, number>()
  for (const a of authors) {
    const doc = await localized<{ id: number }>(
      payload, 'authors',
      { name: a.name, slug: a.slug, role: a.role.az, bio: a.bio.az, social: a.social ?? {} },
      (l) => ({ role: a.role[l], bio: a.bio[l] }),
    )
    authorIds.set(a.id, doc.id)
  }
  console.log(`Müəlliflər: ${authorIds.size}`)

  // Tərəfdaşlar
  const partnerIds = new Map<string, number>()
  for (const p of partners) {
    const doc = await payload.create({ collection: 'partners', data: { name: p.name, website: p.website, type: p.type }, overrideAccess: true })
    partnerIds.set(p.id, doc.id)
  }

  // Reklam slotları
  const slotIds = new Map<string, number>()
  for (const s of adSlots) {
    const doc = await payload.create({ collection: 'ad-slots', data: { key: s.key, active: s.active, size: s.size, mobileSize: s.mobileSize ?? {} }, overrideAccess: true })
    slotIds.set(s.key, doc.id)
  }

  // Media (mock üz qabıqları)
  const upload = async (file: string, alt: Record<Locale, string>, credit?: string) => {
    const doc = await payload.create({
      collection: 'media',
      data: { alt: alt.az, credit },
      filePath: path.resolve(process.cwd(), 'public', file.replace(/^\//, '')),
      locale: 'az',
      overrideAccess: true,
    })
    for (const l of other) await payload.update({ collection: 'media', id: doc.id, data: { alt: alt[l] }, locale: l, overrideAccess: true })
    return doc.id
  }

  const adCreative = await upload('/mock/ad-300x600.svg', { az: 'Caspian Mobility', en: 'Caspian Mobility', ru: 'Caspian Mobility' })
  await payload.create({
    collection: 'ad-campaigns',
    data: {
      name: 'Caspian Mobility — sidebar (nümunə)',
      partner: partnerIds.get('caspian-mobility')!,
      slot: slotIds.get('sidebar')!,
      active: true,
      targetLocales: ['az', 'en', 'ru'],
      creativeType: 'image',
      creative: adCreative,
      url: 'https://example.com',
    },
    context: ctx,
    overrideAccess: true,
  })

  // Məqalələr
  let n = 0
  for (const a of articles) {
    const coverId = await upload(a.cover.src, a.cover.alt, a.cover.credit)
    await localized<{ id: number }>(
      payload, 'articles',
      {
        title: a.title.az,
        slug: a.slug.az,
        excerpt: a.excerpt.az,
        body: blocksToLexical(a.body.az ?? []),
        cover: coverId,
        category: catIds.get(a.categoryId),
        authors: a.authorIds.map((id) => authorIds.get(id)),
        tags: a.tagIds.map((id) => tagIds.get(id)),
        publishedAt: a.publishedAt,
        isPremium: a.isPremium,
        isSponsored: a.isSponsored,
        sponsor: a.sponsorId ? partnerIds.get(a.sponsorId) : undefined,
        isBreaking: Boolean(a.isBreaking),
        isEditorsPick: Boolean(a.isEditorsPick),
        views: a.views,
        _status: 'published',
      },
      (l) =>
        a.title[l] && a.slug[l] && a.body[l]?.length
          ? { title: a.title[l], slug: a.slug[l], excerpt: a.excerpt[l] ?? '', body: blocksToLexical(a.body[l] ?? []), _status: 'published' }
          : null,
    )
    n++
  }
  console.log(`Məqalələr: ${n}`)

  // Parametrlər
  await payload.updateGlobal({
    slug: 'settings',
    locale: 'az',
    data: {
      siteName: 'Good Morning Baku',
      tagline: 'Səhərin ilk etibarlı mənbəyi',
      tickerEnabled: true,
      weather: { city: weather.city.az, tempDay: weather.tempDay, tempNight: weather.tempNight, condition: weather.condition.az, icon: weather.icon },
      contact: { editorialEmail: 'redaksiya@goodmorningbaku.com', salesEmail: 'reklam@goodmorningbaku.com', address: 'Bakı, Azərbaycan' },
      social: [
        { network: 'instagram', url: 'https://instagram.com/goodmorningbaku' },
        { network: 'telegram', url: 'https://t.me/goodmorningbaku' },
        { network: 'facebook', url: 'https://facebook.com/goodmorningbaku' },
        { network: 'youtube', url: 'https://youtube.com/@goodmorningbaku' },
      ],
    },
    context: ctx,
    overrideAccess: true,
  })
  for (const l of other) {
    await payload.updateGlobal({
      slug: 'settings',
      locale: l,
      data: { tagline: l === 'en' ? "The morning's first trusted source" : 'Первый надёжный источник утра', weather: { city: weather.city[l], condition: weather.condition[l] }, contact: { address: l === 'en' ? 'Baku, Azerbaijan' : 'Баку, Азербайджан' } },
      context: ctx,
      overrideAccess: true,
    })
  }
  console.log('Parametrlər yazıldı. Seed tamamlandı.')
  process.exit(0)
}

main().catch((e: Error & { data?: { errors?: { path?: string; message?: string }[] } }) => {
  console.error(e.message)
  for (const err of e.data?.errors ?? []) console.error(`  - ${err.path}: ${err.message}`)
  process.exit(1)
})
