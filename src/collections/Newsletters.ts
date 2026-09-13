import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '@/access'

export const Newsletters: CollectionConfig = {
  slug: 'newsletters',
  labels: { singular: 'Bülleten buraxılışı', plural: 'Bülleten buraxılışları' },
  admin: { useAsTitle: 'subject', group: 'Bülleten', defaultColumns: ['subject', 'sentAt', 'stats'] },
  access: { read: isAdminOrEditor, create: isAdminOrEditor, update: isAdminOrEditor, delete: isAdminOrEditor },
  fields: [
    { name: 'subject', label: 'Mövzu', type: 'text', localized: true, required: true },
    { name: 'intro', label: 'Giriş', type: 'textarea', localized: true },
    { name: 'articles', label: 'Məqalələr', type: 'relationship', relationTo: 'articles', hasMany: true },
    { name: 'sentAt', label: 'Göndərilib', type: 'date', admin: { position: 'sidebar' } },
    {
      name: 'stats',
      label: 'Statistika',
      type: 'group',
      admin: { position: 'sidebar' },
      fields: [
        { name: 'sent', label: 'Göndərilib', type: 'number', defaultValue: 0 },
        { name: 'failed', label: 'Uğursuz', type: 'number', defaultValue: 0 },
      ],
    },
  ],
}
