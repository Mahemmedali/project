import type { ReactNode } from 'react'

// Kök layout keçiddir: <html>/<body> (frontend)/[locale]/layout.tsx və (payload)/layout.tsx-də render olunur.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children
}
