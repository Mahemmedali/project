# Good Morning Baku — Claude Code qaydaları

Arxitektura: `ARCHITECTURE.md` (v1.1). Brend: `docs/brand/GMB_Brand_Book.pptx`. Qərarlar: `docs/decisions/`.

## Stack
Next.js 15 (App Router, TS) · Tailwind CSS 4 (`src/styles/tokens.css` — `@theme` brend tokenləri) · next-intl 4 (AZ əsas, EN, RU; lokallaşdırılmış yollar `src/i18n/routing.ts`) · Payload CMS 3 (Mərhələ 2) · pnpm.

## Komandalar
`pnpm dev` · `pnpm build` · `pnpm lint` · `pnpm typecheck` · `pnpm format` · `pnpm migrate` · `pnpm migrate:create <ad>` · `pnpm generate:types` · `pnpm generate:importmap` · `pnpm seed`

## Payload qaydaları
- Kolleksiya/sahə dəyişəndə: `pnpm migrate:create <ad>` → `pnpm generate:types` → (admin komponenti əlavə olunubsa) `pnpm generate:importmap`. Miqrasiya faylları commit olunur.
- Sahə adı `locales`/`_locales` ola bilməz (Payload-un daxili lokallaşdırma cədvəlləri ilə toqquşur) — `targetLocales` istifadə et.
- Lokallaşdırılmış sahələr `localized: true`; `fallback: false` — tərcümə yoxdursa həmin dildə göstərilmir.
- Access: `src/access` köməkçiləri; hər kolleksiyada `access` açıq şəkildə verilir.
- Dərc → `revalidatePath` hook-ları (`src/hooks/revalidate.ts`); seed/skriptlər `context.disableRevalidate` ötürür.
- Formalar Payload custom endpoint-lərinə yazır (`src/endpoints`), Next route handler yox.
- Media URL-lər `normalizeUrl` ilə (`src/lib/data/payload.ts`) — lokal `/media/…`, prod R2.

## Konvensiyalar
- UI yalnız `src/lib/data` modulundan məlumat alır: `DATABASE_URI` varsa `payload.ts` (Local API), yoxsa `mock.ts` — imzalar eynidir, ikisini də sinxron saxla.
- Lokala görə həll olunmuş `*View` tipləri UI-də; xam `Localized<T>` tipləri yalnız data qatında.
- Rənglər yalnız tokenlərdən (`brand-blue`, `brand-navy`, `brand-yellow`, `brand-gold`, `brand-ink`…). Sarı yalnız mavi/dərin göy fon üzərində.
- Başlıqlar Merriweather (`font-heading`), mətn Inter (`font-body`). Tip şkalası: `text-h1/h2/h3/lead/body/label/caption`.
- Qrafik motiv yalnız `SunriseArcs` (24% sarı, bir küncdə, mətn üzərinə keçmir).
- Loqo yalnız `LogoMark`/`LogoLockup` ilə, `public/brand/gmb-logo.png`; dəyişdirilmir.
- Reklam və sponsorlu məzmun həmişə etiketlənir (`AdSlot`, `SponsoredLabel`, `Badge variant="ad|sponsored"`).
- UI mətnləri `src/messages/{az,en,ru}.json`; kodda sərt mətn yoxdur.
- Yeni marşrut: `routing.pathnames`-ə əlavə et, `alternatesFor()` ilə hreflang ver, `setRequestLocale` çağır.
