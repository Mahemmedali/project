import { describe, expect, it } from 'vitest'
import { clientIp, rateLimit } from '@/lib/rate-limit'

describe('rate limit', () => {
  it('limitdən sonra bloklayır', () => {
    const key = `k-${Math.random()}`
    expect(rateLimit(key, 2, 60_000)).toBe(true)
    expect(rateLimit(key, 2, 60_000)).toBe(true)
    expect(rateLimit(key, 2, 60_000)).toBe(false)
  })
  it('IP-ni Cloudflare / x-forwarded-for başlıqlarından oxuyur', () => {
    expect(clientIp(new Headers({ 'cf-connecting-ip': '1.2.3.4' }))).toBe('1.2.3.4')
    expect(clientIp(new Headers({ 'x-forwarded-for': '5.6.7.8, 9.9.9.9' }))).toBe('5.6.7.8')
    expect(clientIp(new Headers())).toBe('unknown')
  })
})
