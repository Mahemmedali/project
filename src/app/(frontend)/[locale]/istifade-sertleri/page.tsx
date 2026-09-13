import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { alternatesFor, pageMetadata } from '@/lib/seo'
import { formatDate } from '@/lib/format'
import { LegalPage } from '@/components/layout/LegalPage'

type Props = { params: Promise<{ locale: Locale }> }
const UPDATED = '2026-09-01'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'pages.terms' })
  return pageMetadata({ title: t('title'), locale, alternates: alternatesFor(locale, '/istifade-sertleri') })
}

const content: Record<Locale, { h: string; p: string[] }[]> = {
  az: [
    { h: '1. Məzmun', p: ['Good Morning Baku məzmunu şəxsi, qeyri-kommersiya məqsədlə istifadə üçündür. Materialların yenidən dərci yalnız mənbə göstərilməklə və redaksiyanın razılığı ilə mümkündür.'] },
    { h: '2. Reklam və sponsorlu məzmun', p: ['Sponsorlu və reklam xarakterli materiallar həmişə «Reklam» və ya «Tərəfdaş materialı» etiketi ilə işarələnir.'] },
    { h: '3. Düzəlişlər', p: ['Səhv aşkar edildikdə düzəliş açıq şəkildə dərc olunur. Düzəliş tələbi: redaksiya@goodmorningbaku.com.'] },
  ],
  en: [
    { h: '1. Content', p: ['Good Morning Baku content is for personal, non-commercial use. Republishing requires attribution and editorial consent.'] },
    { h: '2. Advertising and sponsored content', p: ['Sponsored and advertising materials are always labelled “Advertisement” or “Partner content”.'] },
    { h: '3. Corrections', p: ['Errors are corrected openly. Correction requests: redaksiya@goodmorningbaku.com.'] },
  ],
  ru: [
    { h: '1. Контент', p: ['Материалы Good Morning Baku предназначены для личного некоммерческого использования. Перепечатка возможна только со ссылкой на источник и с согласия редакции.'] },
    { h: '2. Реклама и спонсорский контент', p: ['Спонсорские и рекламные материалы всегда маркируются «Реклама» или «Партнёрский материал».'] },
    { h: '3. Исправления', p: ['Ошибки исправляются открыто. Запросы на исправление: redaksiya@goodmorningbaku.com.'] },
  ],
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('pages.terms')
  return <LegalPage title={t('title')} updated={t('updated', { date: formatDate(UPDATED, locale) })} sections={content[locale]} />
}
