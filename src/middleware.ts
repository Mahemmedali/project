import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

// Kök `/` → brauzer dilinə görə (cookie ilə yadda saxlanır) `/az`, `/en` və ya `/ru`
export default createMiddleware(routing)

export const config = {
  // Statik fayllar, Next daxili yolları, API və admin (Payload, Mərhələ 2) istisna
  matcher: ['/((?!api|admin|_next|_vercel|.*\\..*).*)'],
}
