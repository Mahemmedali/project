/** Sadə yaddaşdaxili rate limit (bir instansiya üçün kifayətdir; v2: Upstash/KV) */
const hits = new Map<string, { n: number; reset: number }>()

export function rateLimit(key: string, limit = 5, windowMs = 60_000): boolean {
  const now = Date.now()
  const h = hits.get(key)
  if (!h || h.reset < now) {
    hits.set(key, { n: 1, reset: now + windowMs })
    return true
  }
  if (h.n >= limit) return false
  h.n++
  return true
}

export function clientIp(headers: Headers) {
  return headers.get('cf-connecting-ip') ?? headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? headers.get('x-real-ip') ?? 'unknown'
}
