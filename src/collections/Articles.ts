import type { CollectionConfig } from 'payload'
import { articleCreate, articleUpdate, isAdminOrEditor, publishedOrStaff } from '@/access'
import { formatSlug } from '@/hooks/slug'
import { revalidateArticle, revalidateArticleDelete } from '@/hooks/revalidate'
import { authorCannotPublish, computeReadingTime, setCreatedBy } from '@/hooks/article'
import { articleView } from '@/endpoints/views'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export const Articles: CollectionConfig = {
  slug: 'articles',
  labels: { singular: 'Məqalə', plural: 'Məqalələr' },
  admin: {
    useAsTitle: 'title',
    group: 'Məzmun',
    defaultColumns: ['title', 'category', 'authors', '_status', 'publishedAt'],
    livePreview: {
      url: ({ data, locale }) =>
        `${SITE_URL}/preview?secret=${process.env.PREVIEW_SECRET}&collection=articles&id=${data?.id}&locale=${locale?.code ?? 'az'}`,
    },
    preview: (data, { locale }) =>
      `${SITE_URL}/preview?secret=${process.env.PREVIEW_SECRET}&collection=articles&id=${data?.id}&locale=${locale ?? 'az'}`,
  },
  access: { read: publishedOrStaff, create: articleCreate, update: articleUpdate, delete: isAdminOrEditor },
  versions: { drafts: { autosave: { interval: 1500 } }, maxPerDoc: 25 },
  defaultSort: '-publishedAt',
  endpoints: [articleView],
  hooks: {
    beforeChange: [setCreatedBy, computeReadingTime, authorCannotPublish],
    afterChange: [revalidateArticle],
    afterDelete: [revalidateArticleDelete],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Məzmun',
          fields: [
            { name: 'title', label: 'Başlıq', type: 'text', localized: true, required: true },
            {
              name: 'slug',
              label: 'Slug (URL)',
              type: 'text',
              localized: true,
              index: true,
              hooks: { beforeValidate: [formatSlug('title')] },
              admin: { description: 'Boş qalsa başlıqdan avtomatik yaranır' },
            },
            { name: 'excerpt', label: 'Lid / qısa məzmun', type: 'textarea', localized: true, required: true, maxLength: 300 },
            { name: 'body', label: 'Mətn', type: 'richText', localized: true, required: true },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'seo',
              label: 'SEO',
              type: 'group',
              fields: [
                { name: 'title', label: 'Meta başlıq', type: 'text', localized: true },
                { name: 'description', label: 'Meta təsvir', type: 'textarea', localized: true },
                { name: 'noIndex', label: 'İndeksləmə', type: 'checkbox', defaultValue: false },
              ],
            },
          ],
        },
      ],
    },
    // Yan panel
    { name: 'cover', label: 'Üz qabığı', type: 'upload', relationTo: 'media', required: true, admin: { position: 'sidebar' } },
    { name: 'category', label: 'Kateqoriya', type: 'relationship', relationTo: 'categories', required: true, admin: { position: 'sidebar' } },
    { name: 'authors', label: 'Müəlliflər', type: 'relationship', relationTo: 'authors', hasMany: true, required: true, admin: { position: 'sidebar' } },
    { name: 'tags', label: 'Teqlər', type: 'relationship', relationTo: 'tags', hasMany: true, admin: { position: 'sidebar' } },
    {
      name: 'publishedAt',
      label: 'Dərc tarixi',
      type: 'date',
      required: true,
      index: true,
      defaultValue: () => new Date().toISOString(),
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      type: 'collapsible',
      label: 'Etiketlər və növ',
      admin: { position: 'sidebar' },
      fields: [
        { name: 'isBreaking', label: 'Təcili (ticker)', type: 'checkbox', defaultValue: false },
        { name: 'isEditorsPick', label: 'Redaksiyanın seçimi', type: 'checkbox', defaultValue: false },
        { name: 'isPremium', label: 'Premium', type: 'checkbox', defaultValue: false },
        { name: 'isSponsored', label: 'Sponsorlu / Tərəfdaş materialı', type: 'checkbox', defaultValue: false },
        { name: 'sponsor', label: 'Sponsor', type: 'relationship', relationTo: 'partners', admin: { condition: (d) => Boolean(d?.isSponsored) } },
      ],
    },
    { name: 'readingTime', label: 'Oxu vaxtı (dəq)', type: 'number', defaultValue: 1, admin: { position: 'sidebar', readOnly: true } },
    { name: 'views', label: 'Baxış', type: 'number', defaultValue: 0, admin: { position: 'sidebar', readOnly: true } },
    { name: 'createdBy', label: 'Yaradan', type: 'relationship', relationTo: 'users', admin: { position: 'sidebar', readOnly: true } },
  ],
}
