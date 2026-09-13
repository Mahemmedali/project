import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import type { AuthorView } from '@/lib/types'
import { Avatar } from '@/components/ui/Avatar'

export function AuthorByline({ authors, size = 'md' }: { authors: AuthorView[]; size?: 'sm' | 'md' }) {
  const t = useTranslations('article')
  return (
    <div className="flex items-center gap-3">
      <div className="flex -space-x-2">
        {authors.map((a) => (
          <Avatar key={a.id} name={a.name} initials={a.initials} src={a.photo} size={size === 'sm' ? 32 : 44} className="ring-2 ring-white" />
        ))}
      </div>
      <div className="text-[14px] leading-tight">
        <span className="text-brand-faint">{t('by')} </span>
        {authors.map((a, i) => (
          <span key={a.id}>
            <Link href={{ pathname: '/muellif/[slug]', params: { slug: a.slug } }} className="font-semibold text-brand-navy hover:text-brand-blue">
              {a.name}
            </Link>
            {i < authors.length - 1 && ', '}
          </span>
        ))}
        {authors.length === 1 && <p className="text-caption text-brand-faint">{authors[0].role}</p>}
      </div>
    </div>
  )
}
