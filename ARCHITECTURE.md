# Good Morning Baku — Texniki Arxitektura (v1.1 — sıfır-büdcə MVP, təsdiq üçün)

> **Tətbiq qeydləri (2026-09-13):** başlıq şrifti Merriweather (ADR-0001), prod domen goodmorningbaku.com (ADR-0002), Next 15.4.11 (ADR-0003), media saxlama (ADR-0004). Mərhələ 1–2 və 4–5-in əsas hissəsi tamamlanıb; bax `README.md`.

> Bu sənəd Claude Code üçün layihə briefi kimi istifadə olunacaq. Təsdiqdən sonra `ARCHITECTURE.md` kimi repo kökünə qoyulur və `CLAUDE.md` faylından ona istinad edilir.

---

## 1. Məqsəd və tələblər

| Tələb | Həll |
|---|---|
| Xəbər saytı (front-end) | Next.js 15, App Router, SSR/ISR |
| Back-end + CMS dashboard | Payload CMS 3 (Next.js içində işləyir, ayrıca server tələb etmir) |
| 3 dil: AZ (əsas), EN, RU | Payload `localization` + URL prefiksi `/az`, `/en`, `/ru` |
| B2C (oxucular) | Xəbər lenti, bölmələr, axtarış, pulsuz bülleten; **premium/ödəniş MVP-də yoxdur** (model hazır, sonra aktivləşir) |
| B2B (tərəfdaşlar) | Media kit səhifəsi, reklam sorğu forması, CMS-dən idarə olunan reklam slotları, sponsorlu məzmun etiketi; ödəniş — **müqavilə + hesab-faktura ilə əl ilə** |
| Vizual kimlik | Brend kitabındakı rənglər, şriftlər (Fraunces + Inter), qövs motivi — dizayn tokenləri kimi kodlaşdırılır |

---

## 2. Texnologiya seçimi (stack)

| Qat | Seçim | Niyə |
|---|---|---|
| Framework | **Next.js 15** (TypeScript, App Router) | SSR + ISR — xəbər saytı üçün SEO və sürət; tək kod bazası |
| CMS / Back-end | **Payload CMS 3** | Next.js-ə daxilən inteqrasiya olunur; hazır admin paneli, rol sistemi, lokalizasiya, qaralama/versiya, media idarəsi; tam TypeScript |
| Verilənlər bazası | **PostgreSQL 16** | Etibarlı, tam mətn axtarış (v1), Payload-un rəsmi adapteri |
| Fayl saxlama | **Cloudflare R2** — 10 GB pulsuz, çıxış trafiki pulsuz | Şəkillər üçün, CDN ilə |
| Stil | **Tailwind CSS 4** + brend tokenləri | Brend kitabından birbaşa `tailwind.config` / CSS dəyişənləri |
| UI komponentləri | **shadcn/ui** (Radix) əsaslı, brendə uyğunlaşdırılmış | Əlçatanlıq (a11y) hazır gəlir, tam nəzarət bizdədir |
| Zəngin mətn | **Lexical** (Payload standartı) | Rich-text redaktor + JSON saxlama, front-end-də təhlükəsiz render |
| Oxucu autentifikasiyası | **MVP-də yoxdur** — bülleten abunəliyi hesabsız işləyir; `readers` kolleksiyası v2-də açılır | Sadəlik |
| E-poçt | **Resend** — ayda 3 000 məktub pulsuz (bülleten üçün Brevo pulsuz 300/gün alternativ) | Bülleten + forma bildirişləri |
| Ödəniş | **Yoxdur (MVP)**. Sonra: Payriff / Epoint (AZ) — provayder abstraksiyası ilə əlavə olunacaq | Sıfır xərc |
| Axtarış | Postgres full-text (pulsuz, kifayətdir) | Meilisearch yalnız ehtiyac olsa |
| Keş | Next.js ISR + `revalidateTag` (Payload hook-larından) | Redaktor dərc edəndə səhifə dərhal yenilənir |
| Analitika | **Cloudflare Web Analytics** (pulsuz, cookie-siz) + GA4 istəyə görə | Sıfır xərc |
| Reklam | CMS-dən idarə olunan slotlar (pulsuz); Google AdSense istəyə görə əlavə gəlir | B2B satışını CMS-dən başlatmaq |
| Hosting | **Vercel Hobby + Neon (Postgres) + R2** — hamısı pulsuz plan | Aşağıda şərtlər |
| Keyfiyyət | ESLint, Prettier, Vitest, Playwright (e2e), GitHub Actions CI | |

**Alternativ nəzərdən keçirilib, rədd edilib:** Strapi (ayrıca server, lokalizasiya zəif), WordPress (PHP, brend UI-ni tam idarə etmək çətin), Sanity (SaaS, məlumat bizdə qalmır).

---

## 3. Sistem arxitekturası

```
                ┌────────────────────────────────────────────────┐
  Oxucu (B2C)   │              Next.js 15 (tək tətbiq)            │
  Tərəfdaş(B2B) │                                                │
  ───────────►  │  /az /en /ru   ──►  App Router (RSC, ISR)      │
                │  /admin        ──►  Payload Admin Panel        │
                │  /api/*        ──►  Payload REST + GraphQL      │
                │  /api/webhooks ──►  Ödəniş, e-poçt callback     │
                └───────┬──────────────┬───────────────┬─────────┘
                        │              │               │
                  Neon Postgres    Cloudflare R2     Resend (e-poçt)
                  (pulsuz plan)    (media, pulsuz)   (pulsuz plan)
```

- **Bir deploy, iki üz:** eyni Next.js prosesi həm saytı, həm `/admin` panelini, həm API-ni verir.
- **Publish → cache:** Payload `afterChange` hook-u `revalidateTag('article:<slug>')` çağırır; ISR səhifələri saniyələr içində yenilənir.
- **Preview:** redaktor qaralamanı `/az/preview?secret=…` linki ilə dərc etməzdən əvvəl görür (Payload Live Preview).

---

## 4. Məlumat modeli (Payload kolleksiyaları)

Lokalizə olunan sahələr **(L)** ilə işarələnib — AZ/EN/RU üçün ayrı dəyər saxlanır.

| Kolleksiya | Əsas sahələr | Qeyd |
|---|---|---|
| `articles` | title (L), slug (L), excerpt (L), body (L, Lexical), cover (media), category, tags[], authors[], status (draft/published), publishedAt, **isPremium**, **isSponsored**, sponsor (→ partners), seo (L), readingTime | Qaralama + versiya tarixçəsi aktiv |
| `categories` | name (L), slug (L), description (L), color (palitradan), order | Gündəm, Şəhər, İqtisadiyyat, Mədəniyyət, İdman… |
| `tags` | name (L), slug (L) | |
| `authors` | name, photo, bio (L), role, social | Redaksiya profilləri |
| `pages` | title (L), slug (L), blocks (L) — hero, mətn, kart şəbəkəsi, CTA, media kit cədvəli | "Haqqımızda", "Media kit", "Reklam" və s. |
| `media` | file, alt (L), credit, focal point | Avtomatik ölçülər: thumb / card / hero / og |
| `users` | email, roles[] | **Admin panel istifadəçiləri**: `admin`, `editor`, `author`, `sales` |
| `readers` *(v2)* | email, name, locale, plan, newsletterOptIn | MVP-də yaradılmır |
| `subscriptions` *(v2)* | reader, plan, provider, status | Ödəniş provayderi gələndə |
| `newsletter_subscribers` | email, locale, status, confirmedAt, source | Double opt-in |
| `newsletters` | subject (L), articles[], sentAt, stats | Səhər xülasəsi; avtomatik/cron |
| `partners` | name, logo, website, type (advertiser/sponsor) | B2B müştəri qeydi |
| `ad_slots` | key (home_top, article_inline, sidebar…), size, active | Səhifədəki yerlər |
| `ad_campaigns` | partner, slot, creative (media/HTML), url, startAt, endAt, locales[], impressions, clicks | v1 reklam idarəsi |
| `b2b_leads` | company, contact, email, phone, service (display/native/sponsored/corporate/event), budget, message, status (new/contacted/won/lost) | "Reklam sorğusu" forması buraya yazır; Resend ilə satış komandasına bildiriş. **MVP-də B2B satış prosesi:** sorğu → əl ilə təklif → müqavilə → hesab-faktura → kampaniya CMS-də aktivləşir |
| **Globals:** `settings` | siteName (L), nav (L), footer (L), social, contact, defaultSeo (L), tickerEnabled | Sayt səviyyəli parametrlər |

**Rollar və icazələr**

| Rol | İcazə |
|---|---|
| admin | hər şey, istifadəçilər, parametrlər |
| editor | bütün məqalələri redaktə/dərc, kateqoriya, bülleten |
| author | yalnız öz məqalələrini yaratmaq/redaktə (dərc edə bilmir) |
| sales | partners, ad_campaigns, b2b_leads, media kit səhifəsi |
| reader *(v2)* | öz profili, abunəliyi; premium məqalələrə giriş |

---

## 5. Lokalizasiya strategiyası

- URL: `/az/...` (əsas), `/en/...`, `/ru/...`; kök `/` → brauzer dilinə görə `/az`-a yönləndirmə (cookie ilə yadda saxlanır).
- Slug-lar hər dil üçün ayrıdır (`/az/seher/metro-xetti`, `/en/city/metro-line`); məqalə bir dildə tərcümə olunmayıbsa, o dildə göstərilmir və dil keçidi passiv olur.
- `hreflang` + `x-default` bütün səhifələrdə; `sitemap.xml` dilə görə bölünür.
- UI mətnləri (düymə, etiket) `messages/{az,en,ru}.json` — `next-intl`.
- Tarix/rəqəm formatı `Intl` ilə lokala görə (məs. `7,25%` AZ/RU, `7.25%` EN).
- Admin paneli AZ dilində (Payload i18n), redaktor məqaləni tab-larla üç dildə doldurur.

---

## 6. Səhifə xəritəsi

**B2C**
- `/` ana səhifə — hero (gündəm), "Səhər xülasəsi" bloku, bölmə lentləri, bülleten CTA, reklam slotları
- `/{kateqoriya}` bölmə səhifəsi (səhifələmə / sonsuz lent)
- `/{kateqoriya}/{slug}` məqalə — oxu vaxtı, müəllif, paylaşım, əlaqəli xəbərlər, premium paywall (isPremium), "Reklam / Tərəfdaş materialı" etiketi (isSponsored)
- `/axtaris?q=` axtarış
- `/muellif/{slug}`, `/teq/{slug}`
- `/premium`, `/hesab` — **v2** (ödəniş provayderi ilə birlikdə)
- `/bulleten` — abunə + arxiv
- `/haqqimizda`, `/elaqe`, `/mexfilik`, `/istifade-sertleri`

**B2B**
- `/reklam` — təkliflər (displey, nativ, sponsorlu məzmun, korporativ abunəlik, tədbir), auditoriya rəqəmləri, format cədvəli
- `/media-kit` — PDF yükləmə + formalar/ölçülər
- `/reklam/sorgu` — B2B sorğu forması → `b2b_leads` + satış komandasına e-poçt
- `/korporativ` — korporativ abunəlik/xidmətlər — MVP-də sadə səhifə + eyni sorğu forması

**Sistem**
- `/admin` — CMS; `/api/*` — Payload; `/preview` — canlı önizləmə; `/sitemap.xml`, `/robots.txt`, `/rss.xml` (dilə görə)

---

## 7. Repo strukturu

```
goodmorningbaku/
├─ CLAUDE.md                 # Claude Code üçün qaydalar (stack, komandalar, konvensiyalar)
├─ ARCHITECTURE.md           # bu sənəd
├─ docs/
│  ├─ brand/                 # brend kitabı PDF + loqo SVG/PNG + şriftlər
│  └─ decisions/             # ADR-lər (qərar qeydləri)
├─ src/
│  ├─ app/
│  │  ├─ (frontend)/[locale]/       # sayt səhifələri
│  │  │  ├─ page.tsx                # ana səhifə
│  │  │  ├─ [category]/[slug]/      # məqalə
│  │  │  ├─ reklam/  media-kit/  bulleten/  axtaris/ ...
│  │  │  └─ layout.tsx
│  │  ├─ (payload)/admin/           # Payload admin
│  │  └─ api/                       # payload api + webhooks
│  ├─ collections/           # articles.ts, categories.ts, readers.ts ...
│  ├─ globals/               # settings.ts
│  ├─ blocks/                # səhifə blokları (hero, cardGrid, cta, mediaKitTable)
│  ├─ components/
│  │  ├─ ui/                 # UI kit: Button, Badge, Card, Input, Tabs ... (brend tokenləri)
│  │  ├─ layout/             # Header, Footer, LocaleSwitcher, Ticker
│  │  ├─ article/            # ArticleCard, ArticleHero, RichText, Paywall, SponsoredLabel
│  │  └─ ads/                # AdSlot
│  ├─ lib/                   # payload client, i18n, formatters, seo, analytics
│  ├─ styles/
│  │  ├─ tokens.css          # brend rəngləri, şrift, radius, spacing (CSS dəyişənləri)
│  │  └─ globals.css
│  ├─ messages/{az,en,ru}.json
│  ├─ payload.config.ts
│  └─ middleware.ts          # locale yönləndirmə
├─ public/fonts/             # Fraunces, Inter (self-host)
├─ tests/                    # vitest + playwright
├─ docker-compose.yml        # postgres, meilisearch (v2), app
├─ .env.example
└─ package.json
```

---

## 8. Dizayn tokenləri (brend kitabından)

```css
:root {
  --color-blue:   #0424D9;  /* GMB Mavi — əsas */
  --color-navy:   #03178C;  /* Gecə Mavisi */
  --color-yellow: #F2E74B;  /* Səhər Sarısı — vurğu */
  --color-gold:   #F2C744;  /* Qızılı — premium/reklam etiketi */
  --color-black:  #0D0D0D;  /* mətn */
  --color-tint:   #EEF1FB;  /* kart fonu */
  --font-heading: "Fraunces", Georgia, serif;
  --font-body:    "Inter", Arial, sans-serif;
  --radius-card:  16px;  --radius-btn: 8px;
}
```
Tailwind-də `brand.blue`, `brand.yellow` və s. kimi; kontrast qaydaları (min 4,5:1) lint səviyyəsində yoxlanır.

---

## 9. Təhlükəsizlik və performans

- HTTPS, HSTS, CSP; admin panelə IP/2FA (v2); rate limit formalarda; Turnstile (Cloudflare) anti-spam.
- Şəkillər `next/image` + R2 CDN, AVIF/WebP; LCP < 2,5 s, CLS < 0,1 hədəfi.
- Reklam kreativləri sandbox iframe-də.
- Backup: Neon-un daxili 7 günlük tarixçəsi + həftəlik `pg_dump` (GitHub Actions cron → R2).
- GDPR/AZ qanunvericiliyi: cookie razılığı, bülleten üçün double opt-in, hesab silmə.

---

## 10. Hosting — sıfır-büdcə plan

| Servis | Pulsuz plan | Limit / şərt |
|---|---|---|
| **Vercel** (Next.js + Payload) | Hobby — $0 | 100 GB trafik/ay, funksiyalar 10 s; **rəsmi olaraq yalnız qeyri-kommersiya üçün** — reklam satışı başlayanda Pro ($20/ay) və ya VPS-ə keçmək lazımdır |
| **Neon** (PostgreSQL) | $0 | 0,5 GB, 5 dəq. boşluqdan sonra yatır (ilk sorğu ~1 s) — ISR bunu gizlədir |
| **Cloudflare R2** (media) | $0 | 10 GB saxlama, çıxış pulsuz |
| **Cloudflare** DNS + CDN + Web Analytics + Turnstile | $0 | — |
| **Resend** (e-poçt) | $0 | 3 000 məktub/ay, 1 domen |
| **GitHub** (kod + Actions CI) | $0 | 2 000 dəq/ay |
| **Domen** `goodmorningbaku.az` | ≈ 20–30 AZN/il | yeganə məcburi xərc |

**Yekun: ≈ 0 AZN/ay** (domen istisna). Kommersiya trafiki və ya Neon limiti aşılanda **Hetzner CX22 VPS (≈ €4/ay) + Coolify** ilə eyni Docker imici köçürülür — kod dəyişmir, yalnız `.env`.

## 11. Mərhələlər — MVP (Claude Code ilə)

| # | Mərhələ | Nəticə |
|---|---|---|
| 0 | Repo, CLAUDE.md, Payload + Next.js quraşdırma, Neon + R2 + Vercel bağlantısı | `/admin` açılır, boş sayt canlıdır |
| 1 | **UI kit** — tokens.css, Tailwind, şriftlər, Button/Badge/Card/Input/Tabs, Header/Footer | Brend kitabına uyğun komponentlər |
| 2 | Məlumat modeli — articles, categories, tags, authors, pages, media, users, settings; 3 dil; preview | CMS-dən 3 dildə məqalə daxil etmək mümkün |
| 3 | B2C səhifələr — ana, bölmə, məqalə, müəllif, teq, axtarış, RSS, sitemap, SEO | Sayt oxuna bilən vəziyyətdə |
| 4 | Bülleten — abunə forması (double opt-in), `newsletter_subscribers`, həftəlik/gündəlik göndəriş (Vercel Cron + Resend) | Pulsuz B2C bağlılıq kanalı |
| 5 | B2B — `/reklam`, `/media-kit`, sorğu forması → `b2b_leads` + e-poçt; `ad_slots` + `ad_campaigns`; sponsorlu etiket | Reklam satışı başlaya bilər |
| 6 | Keyfiyyət — testlər, a11y, Lighthouse, analitika, CI | Lighthouse ≥ 90 |
| 7 | Launch — domen, SSL, ilkin məzmun | Canlı sayt |
| **v2** | Oxucu hesabı, premium paywall, ödəniş provayderi (Payriff/Epoint), Meilisearch, AdSense/Ad Manager | Büdcə və tərəfdaş yarananda |

## 12. Təsdiq üçün qərarlar

Qəbul edilmiş: ödəniş yoxdur (v2), sıfır-büdcə stack, B2B satış əl ilə.

1. **Stack:** Next.js 15 + Payload CMS 3 + Neon Postgres — razısınız?
2. **Vercel Hobby şərti** (qeyri-kommersiya) sizə aydındır? Reklam gəliri başlayanda €4/ay VPS-ə keçid planı qəbul edilirmi?
3. **Domen:** `goodmorningbaku.az` — mövcuddur, ya alınacaq? (yeganə xərc)
4. **Kateqoriyalar:** Gündəm, Şəhər, İqtisadiyyat, Mədəniyyət, İdman — kifayətdir?
5. **Bülleten tezliyi:** hər səhər (adına uyğun) yoxsa həftəlik başlayaq?

Təsdiqdən sonra **Mərhələ 1 — UI kit** üçün detallı spesifikasiya və Claude Code prompt-larına keçirik.
