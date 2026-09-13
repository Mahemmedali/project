# ADR-0006 — Analitika və razılıq

**Status:** qəbul edilib · 2026-09-13

- **Cloudflare Web Analytics** (`NEXT_PUBLIC_CF_ANALYTICS_TOKEN`) — cookie-siz, razılıq banneri tələb etmir; həmişə yüklənir.
- **GA4** (`NEXT_PUBLIC_GA_ID`) — yalnız oxucu razılıq verəndə (`Analytics` komponenti, `localStorage: gmb-consent`), `anonymize_ip`. Açar boşdursa banner göstərilmir.
- Baxış sayğacı (`POST /api/articles/:id/view`, `sendBeacon`) şəxsi məlumat saxlamır; IP yalnız yaddaşdaxili 10 dəq rate-limit üçün istifadə olunur.
- CSP (`next.config.ts`) yalnız bu hostlara icazə verir: cloudflareinsights, googletagmanager/google-analytics, challenges.cloudflare (Turnstile).
