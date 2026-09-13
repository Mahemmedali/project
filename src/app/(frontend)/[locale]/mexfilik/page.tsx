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
  const t = await getTranslations({ locale, namespace: 'pages.privacy' })
  return pageMetadata({ title: t('title'), locale, alternates: alternatesFor(locale, '/mexfilik') })
}

const content: Record<Locale, { h: string; p: string[] }[]> = {
  az: [
    { h: '1. Hansı məlumatları toplayırıq', p: ['Bülleten abunəliyi üçün yalnız e-poçt ünvanınızı və seçdiyiniz dili saxlayırıq. Reklam sorğusu formasında verdiyiniz şirkət və əlaqə məlumatları yalnız sorğunuza cavab vermək üçün istifadə olunur.'] },
    { h: '2. Analitika və kuki', p: ['Saytda kuki-siz Cloudflare Web Analytics istifadə olunur. Dil seçiminiz brauzerdə kuki ilə yadda saxlanılır.'] },
    { h: '3. Hüquqlarınız', p: ['İstənilən vaxt abunəlikdən imtina edə və məlumatlarınızın silinməsini tələb edə bilərsiniz: redaksiya@goodmorningbaku.com.'] },
  ],
  en: [
    { h: '1. What we collect', p: ['For the newsletter we store only your email address and chosen language. Details submitted in the advertising request form are used solely to respond to your request.'] },
    { h: '2. Analytics and cookies', p: ['We use cookie-less Cloudflare Web Analytics. Your language preference is stored in a browser cookie.'] },
    { h: '3. Your rights', p: ['You can unsubscribe at any time and request deletion of your data: redaksiya@goodmorningbaku.com.'] },
  ],
  ru: [
    { h: '1. Какие данные мы собираем', p: ['Для рассылки мы храним только ваш адрес электронной почты и выбранный язык. Данные из формы заявки на рекламу используются исключительно для ответа на заявку.'] },
    { h: '2. Аналитика и cookie', p: ['На сайте используется Cloudflare Web Analytics без cookie. Выбор языка сохраняется в cookie браузера.'] },
    { h: '3. Ваши права', p: ['Вы можете отписаться в любой момент и запросить удаление данных: redaksiya@goodmorningbaku.com.'] },
  ],
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('pages.privacy')
  return <LegalPage title={t('title')} updated={t('updated', { date: formatDate(UPDATED, locale) })} sections={content[locale]} />
}
