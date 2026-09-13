import { describe, expect, it } from 'vitest'
import { slugify } from '@/hooks/slug'

describe('slugify', () => {
  it('AZ hərflərini latınlaşdırır', () => {
    expect(slugify('İçərişəhərdə yeni qalereya açılır')).toBe('iceriseherde-yeni-qalereya-acilir')
    expect(slugify('Bakı metrosunda yeni stansiya')).toBe('baki-metrosunda-yeni-stansiya')
  })
  it('RU hərflərini transliterasiya edir', () => {
    expect(slugify('Новая станция метро')).toBe('novaya-stanciya-metro')
  })
  it('simvolları və kənar tireləri təmizləyir', () => {
    expect(slugify('  «Qarabağ» — Avropa Liqası! ')).toBe('qarabag-avropa-liqasi')
  })
  it('96 simvoldan uzun olmur', () => {
    expect(slugify('a'.repeat(200)).length).toBeLessThanOrEqual(96)
  })
})
