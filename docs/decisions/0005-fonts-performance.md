# ADR-0005 — Şriftlər: Merriweather 700 statik (self-host), Inter next/font

**Status:** qəbul edilib · 2026-09-13

**Kontekst.** Google-un Merriweather variable faylı (opsz/wdth oxları ilə) hər alt-dəst üçün 76–98 KB idi və next/font bütün alt-dəstləri (o cümlədən kiril) hər səhifədə yükləyirdi — mobil Lighthouse LCP 4–5 s.

**Qərar.**
- Merriweather yalnız **700** çəkidə, statik woff2 (Fontsource 5.3), `public/fonts/`-da; `globals.css`-də `unicode-range` ilə latin / latin-ext / kiril ayrı-ayrı. AZ/EN səhifə ~92 KB, RU ~74 KB yükləyir; lokal üçün lazım olanlar `react-dom` `preload` ilə əvvəlcədən yüklənir.
- Brend kitabındakı **Black (900)** vebdə istifadə edilmir (`font-black` → `font-bold`); loqo yazısı vektordadır, tipoqrafik iyerarxiya 700 ilə qorunur.
- Inter `next/font/google` ilə qalır (variable, alt-dəst başına ~50 KB, `preload: false`).
- Ehtiyat: `Merriweather Fallback` (Georgia, `size-adjust`) — CLS < 0.1.
