import type { Author, Category, Partner, Tag, AdSlot, AdCampaign, Weather } from '@/lib/types'

export const categories: Category[] = [
  {
    id: 'gundem',
    order: 1,
    color: 'blue',
    slug: { az: 'gundem', en: 'news', ru: 'glavnoe' },
    name: { az: 'Gündəm', en: 'News', ru: 'Главное' },
    description: {
      az: 'Günün əsas hadisələri, rəsmi qərarlar və Bakını maraqlandıran mövzular.',
      en: 'The day’s key events, official decisions and the topics Baku is talking about.',
      ru: 'Главные события дня, официальные решения и темы, которые обсуждает Баку.',
    },
  },
  {
    id: 'seher',
    order: 2,
    color: 'navy',
    slug: { az: 'seher', en: 'city', ru: 'gorod' },
    name: { az: 'Şəhər', en: 'City', ru: 'Город' },
    description: {
      az: 'Nəqliyyat, tikinti, məhəllələr, parklar — Bakının gündəlik həyatı.',
      en: 'Transport, construction, neighbourhoods and parks — Baku’s daily life.',
      ru: 'Транспорт, стройки, районы и парки — повседневная жизнь Баку.',
    },
  },
  {
    id: 'iqtisadiyyat',
    order: 3,
    color: 'blue',
    slug: { az: 'iqtisadiyyat', en: 'economy', ru: 'ekonomika' },
    name: { az: 'İqtisadiyyat', en: 'Economy', ru: 'Экономика' },
    description: {
      az: 'Bazarlar, qiymətlər, biznes və şəxsi maliyyə — sadə dillə.',
      en: 'Markets, prices, business and personal finance — in plain language.',
      ru: 'Рынки, цены, бизнес и личные финансы — простым языком.',
    },
  },
  {
    id: 'medeniyyet',
    order: 4,
    color: 'gold',
    slug: { az: 'medeniyyet', en: 'culture', ru: 'kultura' },
    name: { az: 'Mədəniyyət', en: 'Culture', ru: 'Культура' },
    description: {
      az: 'Sərgilər, konsertlər, kino və şəhərin yaradıcı həyatı.',
      en: 'Exhibitions, concerts, film and the city’s creative life.',
      ru: 'Выставки, концерты, кино и творческая жизнь города.',
    },
  },
  {
    id: 'idman',
    order: 5,
    color: 'navy',
    slug: { az: 'idman', en: 'sport', ru: 'sport' },
    name: { az: 'İdman', en: 'Sport', ru: 'Спорт' },
    description: {
      az: 'Futbol, Formula 1, milli komandalar və şəhər idmanı.',
      en: 'Football, Formula 1, national teams and city sport.',
      ru: 'Футбол, Формула-1, сборные и городской спорт.',
    },
  },
]

export const tags: Tag[] = [
  { id: 'metro', slug: { az: 'metro', en: 'metro', ru: 'metro' }, name: { az: 'Metro', en: 'Metro', ru: 'Метро' } },
  { id: 'hava', slug: { az: 'hava', en: 'weather', ru: 'pogoda' }, name: { az: 'Hava', en: 'Weather', ru: 'Погода' } },
  { id: 'neqliyyat', slug: { az: 'neqliyyat', en: 'transport', ru: 'transport' }, name: { az: 'Nəqliyyat', en: 'Transport', ru: 'Транспорт' } },
  { id: 'merkezi-bank', slug: { az: 'merkezi-bank', en: 'central-bank', ru: 'centrobank' }, name: { az: 'Mərkəzi Bank', en: 'Central Bank', ru: 'Центробанк' } },
  { id: 'qarabag-fk', slug: { az: 'qarabag-fk', en: 'qarabag-fk', ru: 'karabah-fk' }, name: { az: 'Qarabağ FK', en: 'Qarabağ FK', ru: 'Карабах ФК' } },
  { id: 'formula-1', slug: { az: 'formula-1', en: 'formula-1', ru: 'formula-1' }, name: { az: 'Formula 1', en: 'Formula 1', ru: 'Формула-1' } },
  { id: 'sergi', slug: { az: 'sergi', en: 'exhibition', ru: 'vystavka' }, name: { az: 'Sərgi', en: 'Exhibition', ru: 'Выставка' } },
  { id: 'qiymetler', slug: { az: 'qiymetler', en: 'prices', ru: 'ceny' }, name: { az: 'Qiymətlər', en: 'Prices', ru: 'Цены' } },
  { id: 'iceriseher', slug: { az: 'iceriseher', en: 'old-city', ru: 'icheri-sheher' }, name: { az: 'İçərişəhər', en: 'Old City', ru: 'Ичери-шехер' } },
  { id: 'startap', slug: { az: 'startap', en: 'startups', ru: 'startapy' }, name: { az: 'Startaplar', en: 'Startups', ru: 'Стартапы' } },
  { id: 'tehsil', slug: { az: 'tehsil', en: 'education', ru: 'obrazovanie' }, name: { az: 'Təhsil', en: 'Education', ru: 'Образование' } },
]

export const authors: Author[] = [
  {
    id: 'aynur-memmedova',
    slug: 'aynur-memmedova',
    name: 'Aynur Məmmədova',
    initials: 'AM',
    role: { az: 'Baş redaktor', en: 'Editor-in-chief', ru: 'Главный редактор' },
    bio: {
      az: '15 ildir Bakı haqqında yazır. Şəhər siyasəti, nəqliyyat və ictimai məkanlar üzrə ixtisaslaşıb.',
      en: 'Has written about Baku for 15 years. Specialises in city policy, transport and public space.',
      ru: 'Пишет о Баку 15 лет. Специализируется на городской политике, транспорте и общественных пространствах.',
    },
    social: { x: 'https://x.com/', linkedin: 'https://linkedin.com/' },
  },
  {
    id: 'elvin-huseynov',
    slug: 'elvin-huseynov',
    name: 'Elvin Hüseynov',
    initials: 'EH',
    role: { az: 'İqtisadiyyat müxbiri', en: 'Economy correspondent', ru: 'Экономический корреспондент' },
    bio: {
      az: 'Maliyyə bazarları, bank sektoru və qiymətlər. Əvvəllər analitik şirkətdə işləyib.',
      en: 'Financial markets, banking and prices. Previously worked at an analytics firm.',
      ru: 'Финансовые рынки, банковский сектор и цены. Ранее работал в аналитической компании.',
    },
  },
  {
    id: 'leyla-qasimova',
    slug: 'leyla-qasimova',
    name: 'Leyla Qasımova',
    initials: 'LQ',
    role: { az: 'Mədəniyyət redaktoru', en: 'Culture editor', ru: 'Редактор отдела культуры' },
    bio: {
      az: 'Sərgilər, teatr və şəhərin yaradıcı icması haqqında yazır.',
      en: 'Writes about exhibitions, theatre and the city’s creative community.',
      ru: 'Пишет о выставках, театре и творческом сообществе города.',
    },
  },
  {
    id: 'rashad-aliyev',
    slug: 'rashad-aliyev',
    name: 'Rəşad Əliyev',
    initials: 'RƏ',
    role: { az: 'İdman müxbiri', en: 'Sports correspondent', ru: 'Спортивный корреспондент' },
    bio: {
      az: 'Futbol və Formula 1. Stadionda olmadığı vaxt velosipeddədir.',
      en: 'Football and Formula 1. When not at the stadium, on a bicycle.',
      ru: 'Футбол и Формула-1. Когда не на стадионе — на велосипеде.',
    },
  },
]

export const partners: Partner[] = [
  { id: 'baku-bank', name: 'Baku Bank', website: 'https://example.com', type: 'sponsor' },
  { id: 'caspian-mobility', name: 'Caspian Mobility', website: 'https://example.com', type: 'advertiser' },
]

export const adSlots: AdSlot[] = [
  { key: 'home_top', size: { w: 970, h: 250 }, mobileSize: { w: 320, h: 100 }, active: true },
  { key: 'home_inline', size: { w: 728, h: 90 }, mobileSize: { w: 320, h: 100 }, active: true },
  { key: 'sidebar', size: { w: 300, h: 600 }, mobileSize: { w: 300, h: 250 }, active: true },
  { key: 'article_inline', size: { w: 728, h: 90 }, mobileSize: { w: 300, h: 250 }, active: true },
  { key: 'article_bottom', size: { w: 970, h: 250 }, mobileSize: { w: 320, h: 100 }, active: true },
  { key: 'category_top', size: { w: 970, h: 250 }, mobileSize: { w: 320, h: 100 }, active: true },
]

export const adCampaigns: AdCampaign[] = [
  {
    id: 'cmp-1',
    partnerId: 'caspian-mobility',
    slot: 'sidebar',
    creative: { src: '/mock/ad-300x600.svg', alt: 'Caspian Mobility' },
    url: 'https://example.com',
    locales: ['az', 'en', 'ru'],
  },
]

export const weather: Weather = {
  city: { az: 'Bakı', en: 'Baku', ru: 'Баку' },
  tempDay: 27,
  tempNight: 19,
  condition: { az: 'Günəşli, axşam yağış', en: 'Sunny, rain in the evening', ru: 'Солнечно, вечером дождь' },
  icon: 'sun',
}
