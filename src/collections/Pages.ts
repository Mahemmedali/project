import type { CollectionConfig } from 'payload'
import { isAdminOrEditor, publishedOrStaff } from '@/access'
import { formatSlug } from '@/hooks/slug'
import { revalidateAll } from '@/hooks/revalidate'
import { pageBlocks } from '@/blocks'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Səhifə', plural: 'Səhifələr' },
  admin: { useAsTitle: 'title', group: 'Məzmun', defaultColumns: ['title', 'slug', '_status', 'updatedAt'] },
  access: { read: publishedOrStaff, create: isAdminOrEditor, update: isAdminOrEditor, delete: isAdminOrEditor },
  versions: { drafts: true },
  hooks: { afterChange: [revalidateAll] },
  fields: [
    { name: 'title', label: 'Başlıq', type: 'text', localized: true, required: true },
    { name: 'slug', label: 'Slug', type: 'text', localized: true, required: true, index: true, hooks: { beforeValidate: [formatSlug('title')] } },
    { name: 'lead', label: 'Giriş', type: 'textarea', localized: true },
    { name: 'blocks', label: 'Bloklar', type: 'blocks', localized: true, blocks: pageBlocks },
    {
      name: 'seo',
      label: 'SEO',
      type: 'group',
      fields: [
        { name: 'title', label: 'Meta başlıq', type: 'text', localized: true },
        { name: 'description', label: 'Meta təsvir', type: 'textarea', localized: true },
        { name: 'image', label: 'OG şəkil', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
