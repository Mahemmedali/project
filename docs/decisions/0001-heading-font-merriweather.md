# ADR-0001 — Başlıq şrifti: Merriweather (Fraunces əvəzinə)

**Status:** qəbul edilib · 2026-09-13

**Kontekst.** `ARCHITECTURE.md` (v1.1) başlıq şriftini Fraunces kimi göstərir; Brend kitabı v1.0 (bölmə 06 — Tipoqrafiya) isə Merriweather Bold/Black-i rəsmi başlıq şrifti kimi müəyyən edir.

**Qərar.** Vizual kimlikdə brend kitabı əsasdır: başlıqlar **Merriweather** (700/900), mətn **Inter** (400–700). Ehtiyat: Georgia / Arial. Şriftlər `next/font/google` ilə build zamanı self-host edilir.

**Nəticə.** `--font-heading` tokeni Merriweather-ə işarə edir; `ARCHITECTURE.md`-dəki Fraunces qeydi köhnəlmiş sayılır.
