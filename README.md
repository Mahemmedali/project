# Good Morning Baku

Bakı üçün üçdilli (AZ/EN/RU) xəbər saytı. Next.js 15 + Tailwind 4 + next-intl · Payload CMS 3 + PostgreSQL.

## Tez başlanğıc

```bash
pnpm install
cp .env.example .env            # DATABASE_URI, PAYLOAD_SECRET və s.
docker compose up -d            # lokal Postgres 16 (və ya Neon connection string)
pnpm migrate                    # sxemi yarat
pnpm seed                       # admin + nümunə məzmun (SEED_ADMIN_EMAIL/PASSWORD)
pnpm dev                        # http://localhost:3000 → /az ; admin: /admin
```

`DATABASE_URI` boş qalsa sayt mock məlumatla (src/lib/mock) işləyir — dizayn baxışı və CI üçün.

## Komandalar

| Komanda | Nə edir |
|---|---|
| `pnpm dev` / `pnpm build` / `pnpm start` | Next.js |
| `pnpm lint` / `pnpm typecheck` / `pnpm format` | Keyfiyyət |
| `pnpm migrate` / `pnpm migrate:create <ad>` | Payload miqrasiyaları (`src/migrations`) |
| `pnpm generate:types` / `pnpm generate:importmap` | Kolleksiya dəyişəndə |
| `pnpm seed` | İlkin məzmun (yalnız boş bazada) |
| `pnpm vercel-build` | Vercel üçün: `migrate && next build` |

## Keyfiyyət (Mərhələ 6)

| Komanda | Nə edir |
|---|---|
| `pnpm test` | Vitest — slug, Lexical çevirmə, format, mock məlumat qatı, rate limit |
| `pnpm test:e2e` | Playwright (masaüstü + mobil): səhifələr, dil keçidi, formalar, sitemap/RSS, **axe** a11y (WCAG 2.1 AA) |
| `pnpm lighthouse` | Lighthouse hesabatı (`lighthouse.html`), server işləyərkən |

CI (`.github/workflows/ci.yml`): lint → typecheck → unit → build (mock rejimi, DB-siz) → e2e. Həftəlik backup (`backup.yml`): `pg_dump` → R2, 8 həftə saxlanılır.
Təhlükəsizlik başlıqları (`next.config.ts`): CSP, HSTS (yalnız https), Permissions-Policy, nosniff. Analitika: Cloudflare Web Analytics (cookie-siz) + istəyə görə GA4 razılıq banneri ilə (ADR-0006).

## Struktur

- `src/app/(frontend)/[locale]/…` — sayt (AZ/EN/RU, lokallaşdırılmış URL-lər `src/i18n/routing.ts`)
- `src/app/(payload)/…` — Payload admin və REST/GraphQL (`/admin`, `/api`)
- `src/collections`, `src/globals`, `src/blocks`, `src/access`, `src/hooks`, `src/endpoints` — CMS modeli
- `src/lib/data` — məlumat qatı (`payload.ts` ↔ `mock.ts`, eyni imzalar)
- `src/components` — UI kit (brend tokenləri `src/styles/tokens.css`)

## API (Payload custom endpoints)

| Yol | Metod | Təyinat |
|---|---|---|
| `/api/newsletter` | POST `{email, locale, source}` | abunə → təsdiq məktubu (double opt-in) |
| `/api/newsletter/confirm?token=` | GET | təsdiq |
| `/api/newsletter/unsubscribe?token=` | GET | imtina |
| `/api/newsletter/send` | GET/POST, `Authorization: Bearer CRON_SECRET` | səhər xülasəsi (Vercel Cron, `vercel.json`) |
| `/api/leads` | POST | B2B reklam sorğusu → `b2b-leads` + satış e-poçtu |
| `/preview?secret=&id=&locale=` | GET | CMS önizləmə / Live Preview |

Rollar: `admin` (hər şey), `editor` (məzmun + dərc), `author` (yalnız öz məqalələri, dərc edə bilmir), `sales` (tərəfdaşlar, reklam, sorğular).

## Prod (goodmorningbaku.com)

Vercel: build command `pnpm vercel-build`; env: `DATABASE_URI` (Neon, pooled), `PAYLOAD_SECRET`, `PREVIEW_SECRET`, `NEXT_PUBLIC_SITE_URL=https://goodmorningbaku.com`, `R2_*`, `RESEND_API_KEY`, `EMAIL_FROM`, `SALES_EMAIL`, `CRON_SECRET`, istəyə görə Turnstile açarları.

Sənədlər: `ARCHITECTURE.md`, `CLAUDE.md`, `docs/decisions/`, brend kitabı `docs/brand/`.
