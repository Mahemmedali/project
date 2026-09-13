import Image from 'next/image'
import { cn } from '@/lib/utils'

export function CoverImage({
  src,
  alt,
  className,
  priority,
  sizes = '(max-width: 768px) 100vw, 50vw',
}: {
  src: string
  alt: string
  className?: string
  priority?: boolean
  sizes?: string
}) {
  return (
    <div className={cn('relative overflow-hidden rounded-card bg-brand-tint', className)}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        fetchPriority={priority ? 'high' : undefined}
        sizes={sizes}
        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      />
    </div>
  )
}
