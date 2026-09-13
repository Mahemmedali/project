// Kök 404 — yalnız lokal prefiksi olmayan / tanınmayan yollar üçün (məs. /foo.txt). Lokallaşdırılmış 404: (frontend)/[locale]/not-found.tsx
export default function RootNotFound() {
  return (
    <html lang="az">
      <body style={{ margin: 0, fontFamily: 'Inter, Arial, sans-serif', background: '#0424D9', color: '#fff', minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <main style={{ textAlign: 'center', padding: 24 }}>
          <p style={{ fontFamily: 'Georgia, serif', fontSize: 96, fontWeight: 900, color: '#F2E74B', margin: 0, lineHeight: 1 }}>404</p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 28, margin: '16px 0 8px' }}>Səhifə tapılmadı</h1>
          <p style={{ color: '#C9D0F6', margin: '0 0 24px' }}>Axtardığınız səhifə köçürülüb və ya mövcud deyil.</p>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/az" style={{ display: 'inline-block', background: '#F2E74B', color: '#03178C', textDecoration: 'none', fontWeight: 600, fontSize: 13, letterSpacing: '.06em', textTransform: 'uppercase', padding: '14px 24px', borderRadius: 8 }}>
            Ana səhifəyə qayıt
          </a>
        </main>
      </body>
    </html>
  )
}
