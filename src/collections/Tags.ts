import type { CollectionConfig } from 'payload'
import { anyone, isAdminOrEditor } from '@/access'
import { formatSlug } from '@/hooks/slug'
import { revalidateAll } from '@/hooks/revalidate'

export const Tags: CollectionConfig = {
  slug: 'tags',
  labels: { singular: 'Teq', plural: 'Teqlər' },
  admin: { useAsTitle: 'name', group: 'Məzmun', defaultColumns: ['name', 'slug'] },
  access: { read: anyone, create: isAdminOrEditor, update: isAdminOrEditor, delete: isAdminOrEditor },
  hooks: { afterChange: [revalidateAll] },
  fields: [
    { name: 'name', label: 'Ad', type: 'text', localized: true, required: true },
    { name: 'slug', label: 'Slug', type: 'text', localized: true, required: true, index: true, hooks: { beforeValidate: [formatSlug('name')] } },
  ],
}
