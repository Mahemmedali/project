import { describe, expect, it } from 'vitest'
import * as data from '@/lib/data/mock'

describe('mock data layer', () => {
  it('kateqoriyalar sıralı və lokallaşdırılmışdır', async () => {
    const az = await data.getCategories('az')
    const en = await data.getCategories('en')
    expect(az.map((c) => c.slug)).toEqual(['gundem', 'seher', 'iqtisadiyyat', 'medeniyyet', 'idman'])
    expect(en.find((c) => c.id === 'seher')?.slug).toBe('city')
  })

  it('tərcümə olunmayan məqalə həmin dildə görünmür', async () => {
    const ru = await data.getArticles({ locale: 'ru', limit: 100 })
    expect(ru.items.some((a) => a.id === 'a11')).toBe(false) // yalnız AZ/EN
    const az = await data.getArticles({ locale: 'az', limit: 100 })
    expect(az.items.some((a) => a.id === 'a11')).toBe(true)
  })

  it('slug ilə məqalə və alternativlər', async () => {
    const a = await data.getArticleBySlug('en', 'city', 'new-metro-station-opens-tomorrow')
    expect(a?.id).toBe('a1')
    expect(a?.alternates.az).toEqual({ category: 'seher', slug: 'metroda-yeni-stansiya-sabah-acilir' })
    expect(a?.alternates.ru?.category).toBe('gorod')
  })

  it('axtarış başlıq və müəllif üzrə işləyir', async () => {
    const byTitle = await data.getArticles({ locale: 'az', q: 'metro' })
    expect(byTitle.total).toBeGreaterThan(0)
    const byAuthor = await data.getArticles({ locale: 'az', q: 'Aynur' })
    expect(byAuthor.items.every((a) => a.authors.some((x) => x.name.includes('Aynur')))).toBe(true)
  })

  it('reklam slotu və kampaniya', async () => {
    const ad = await data.getAd('sidebar', 'az')
    expect(ad?.slot.size).toEqual({ w: 300, h: 600 })
    expect(ad?.campaign?.creative?.src).toContain('ad-300x600')
    expect(await data.getAd('home_top', 'az')).toMatchObject({ campaign: null })
  })

  it('səhifələmə', async () => {
    const p1 = await data.getArticles({ locale: 'az', limit: 5 })
    const p2 = await data.getArticles({ locale: 'az', limit: 5, offset: 5 })
    expect(p1.items.map((a) => a.id)).not.toEqual(p2.items.map((a) => a.id))
    expect(p1.total).toBe(p2.total)
  })
})
