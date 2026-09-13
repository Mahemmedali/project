import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { az } from '@payloadcms/translations/languages/az'
import { en } from '@payloadcms/translations/languages/en'
import { ru } from '@payloadcms/translations/languages/ru'
import sharp from 'sharp'

import { Users } from '@/collections/Users'
import { Media } from '@/collections/Media'
import { Articles } from '@/collections/Articles'
import { Categories } from '@/collections/Categories'
import { Tags } from '@/collections/Tags'
import { Authors } from '@/collections/Authors'
import { Pages } from '@/collections/Pages'
import { Partners } from '@/collections/Partners'
import { AdSlots } from '@/collections/AdSlots'
import { AdCampaigns } from '@/collections/AdCampaigns'
import { NewsletterSubscribers } from '@/collections/NewsletterSubscribers'
import { Newsletters } from '@/collections/Newsletters'
import { B2BLeads } from '@/collections/B2BLeads'
import { Settings } from '@/globals/Settings'
import { confirm, sendGet, sendPost, subscribe, unsubscribe } from '@/endpoints/newsletter'
import { createLead } from '@/endpoints/leads'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

const r2Enabled = Boolean(process.env.R2_BUCKET && process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY)

export default buildConfig({
  serverURL: SITE_URL,
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: ' — GMB Admin', icons: [{ rel: 'icon', url: '/brand/gmb-logo.png' }] },
    livePreview: {
      collections: ['articles'],
      url: ({ data, locale }) => `${SITE_URL}/preview?secret=${process.env.PREVIEW_SECRET}&collection=articles&id=${data?.id}&locale=${locale?.code ?? 'az'}`,
      breakpoints: [
        { label: 'Mobil', name: 'mobile', width: 390, height: 844 },
        { label: 'Planşet', name: 'tablet', width: 820, height: 1180 },
        { label: 'Masaüstü', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  localization: {
    locales: [
      { label: 'Azərbaycanca', code: 'az' },
      { label: 'English', code: 'en' },
      { label: 'Русский', code: 'ru' },
    ],
    defaultLocale: 'az',
    fallback: false, // tərcümə yoxdursa boş qalır → həmin dildə göstərilmir
  },
  i18n: { supportedLanguages: { az, en, ru }, fallbackLanguage: 'az' },
  collections: [Articles, Categories, Tags, Authors, Pages, Media, Partners, AdSlots, AdCampaigns, NewsletterSubscribers, Newsletters, B2BLeads, Users],
  globals: [Settings],
  editor: lexicalEditor(),
  endpoints: [subscribe, confirm, unsubscribe, sendGet, sendPost, createLead],
  secret: process.env.PAYLOAD_SECRET ?? 'insecure-dev-secret',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI },
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  sharp,
  plugins: [
    ...(r2Enabled
      ? [
          s3Storage({
            collections: {
              media: {
                prefix: 'media',
                disablePayloadAccessControl: true,
                generateFileURL: ({ filename, prefix }) => `${process.env.R2_PUBLIC_URL}/${prefix}/${filename}`,
              },
            },
            bucket: process.env.R2_BUCKET!,
            config: {
              endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
              region: 'auto',
              forcePathStyle: true,
              credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID!, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY! },
            },
          }),
        ]
      : []),
  ],
  cors: [SITE_URL],
  csrf: [SITE_URL],
  upload: { limits: { fileSize: 10 * 1024 * 1024 } },
})
