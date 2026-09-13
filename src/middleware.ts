import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

// Kök `/` → brauzer dilinə görə (cookie ilə yadda saxlanır) `/az`, `/en` və ya `/ru`
export default createMiddleware(routing)

export const config = {
  // Statik fayllar, Next daxili yolları, Payload (api/admin), preview və metadata faylları istisna
  matcher: ['/((?!api|admin|preview|_next|_vercel|robots\\.txt|sitemap\\.xml|favicon\\.ico|brand/|mock/|media/|fonts/).*)'],
}
