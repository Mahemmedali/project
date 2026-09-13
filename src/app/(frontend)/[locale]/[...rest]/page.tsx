import { notFound } from 'next/navigation'

// Tanınmayan yollar → lokallaşdırılmış 404
export default function CatchAll() {
  notFound()
}
