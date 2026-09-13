import type { CollectionConfig } from 'payload'
import { anyone, isAdminOrEditor } from '@/access'
import { formatSlug } from '@/hooks/slug'
import { revalidateAll } from '@/hooks/revalidate'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Kateqoriya', plural: 'Kateqoriyalar' },
  admin: { useAsTitle: 'name', group: 'Məzmun', defaultColumns: ['name', 'slug', 'order', 'color'] },
  access: { read: anyone, create: isAdminOrEditor, update: isAdminOrEditor, delete: isAdminOrEditor },
  hooks: { afterChange: [revalidateAll] },
  defaultSort: 'order',
  fields: [
    { name: 'name', label: 'Ad', type: 'text', localized: true, required: true },
    {
      name: 'slug',
      label: 'Slug (URL)',
      type: 'text',
      localized: true,
      required: true,
      index: true,
      hooks: { beforeValidate: [formatSlug('name')] },
      admin: { description: 'Hər dil üçün ayrı: seher / city / gorod' },
    },
    { name: 'description', label: 'Təsvir', type: 'textarea', localized: true },
    {
      name: 'color',
      label: 'Rəng',
      type: 'select',
      defaultValue: 'blue',
      options: [
        { label: 'Səhər mavisi', value: 'blue' },
        { label: 'Dərin göy', value: 'navy' },
        { label: 'Günəş qızılı', value: 'gold' },
        { label: 'Şəfəq sarısı', value: 'yellow' },
      ],
    },
    { name: 'order', label: 'Sıra', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
