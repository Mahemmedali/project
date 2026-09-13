import type { CollectionConfig } from 'payload'
import { anyone, isAdminOrEditor } from '@/access'
import { formatSlug } from '@/hooks/slug'
import { revalidateAll } from '@/hooks/revalidate'

export const Authors: CollectionConfig = {
  slug: 'authors',
  labels: { singular: 'Müəllif', plural: 'Müəlliflər' },
  admin: { useAsTitle: 'name', group: 'Məzmun', defaultColumns: ['name', 'role', 'slug'] },
  access: { read: anyone, create: isAdminOrEditor, update: isAdminOrEditor, delete: isAdminOrEditor },
  hooks: { afterChange: [revalidateAll] },
  fields: [
    { name: 'name', label: 'Ad Soyad', type: 'text', required: true },
    { name: 'slug', label: 'Slug', type: 'text', required: true, unique: true, index: true, hooks: { beforeValidate: [formatSlug('name')] } },
    { name: 'photo', label: 'Foto', type: 'upload', relationTo: 'media' },
    { name: 'role', label: 'Vəzifə', type: 'text', localized: true, required: true },
    { name: 'bio', label: 'Bio', type: 'textarea', localized: true },
    {
      name: 'social',
      label: 'Sosial',
      type: 'group',
      fields: [
        { name: 'x', label: 'X', type: 'text' },
        { name: 'linkedin', label: 'LinkedIn', type: 'text' },
        { name: 'instagram', label: 'Instagram', type: 'text' },
      ],
    },
    { name: 'user', label: 'Sistem istifadəçisi', type: 'relationship', relationTo: 'users', admin: { position: 'sidebar', description: 'Müəllif rolu üçün: bu profil hansı hesaba aiddir' } },
  ],
}
