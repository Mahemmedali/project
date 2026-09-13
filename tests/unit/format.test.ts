import { describe, expect, it } from 'vitest'
import { formatCompact, formatDate, formatNumber, formatTime } from '@/lib/format'

describe('format', () => {
  const iso = '2026-09-13T07:30:00+04:00'
  it('Bakı vaxtı ilə saat', () => {
    expect(formatTime(iso, 'az')).toBe('07:30')
    expect(formatTime('2026-09-13T03:30:00Z', 'en')).toBe('07:30')
  })
  it('lokala görə tarix', () => {
    expect(formatDate(iso, 'az')).toContain('2026')
    expect(formatDate(iso, 'en')).toBe('13 September 2026')
    expect(formatDate(iso, 'ru')).toContain('сентября')
  })
  it('faiz və rəqəm ayırıcıları lokala görə', () => {
    expect(formatNumber(0.0725, 'en', { style: 'percent', maximumFractionDigits: 2 })).toBe('7.25%')
    expect(formatNumber(0.0725, 'ru', { style: 'percent', maximumFractionDigits: 2 })).toMatch(/^7,25\s%$/)
  })
  it('kompakt', () => {
    expect(formatCompact(250000, 'en')).toMatch(/^250[kK]$/)
  })
})
