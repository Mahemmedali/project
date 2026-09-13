# ADR-0004 — Media saxlama: lokal (dev) / Cloudflare R2 (prod)

**Status:** qəbul edilib · 2026-09-13

- R2 dəyişənləri (`R2_*`) boşdursa fayllar `public/media` qovluğuna yazılır və sayt onları `/media/<fayl>` kimi statik verir (`normalizeUrl` Payload-un `/api/media/file/...` ünvanını çevirir).
- Prod-da (Vercel) fayl sistemi qalıcı deyil → **R2 mütləqdir**; `@payloadcms/storage-s3` plagini `R2_PUBLIC_URL` ilə tam URL qaytarır, `next.config` həmin hostu `remotePatterns`-ə əlavə edir.
- SVG-lər üçün ölçülü variantlar yaradılmır (Payload/sharp), raster (JPG/PNG/WebP) üçün `thumb/card/hero/og` yaranır.
