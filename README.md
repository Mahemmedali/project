# Good Morning Baku

Bakı üçün üçdilli (AZ/EN/RU) xəbər saytı. Next.js 15 + Tailwind 4 + next-intl; Payload CMS 3 (Mərhələ 2).

```bash
pnpm install
cp .env.example .env
pnpm dev        # http://localhost:3000 → /az
pnpm build && pnpm start
```

Sənədlər: `ARCHITECTURE.md`, `CLAUDE.md`, `docs/decisions/`, brend kitabı `docs/brand/`.

**Mərhələ 1 (cari):** UI kit + bütün səhifələr mock məlumatla (`src/lib/mock`). Real məzmun Mərhələ 2-də CMS-dən gəlir.
