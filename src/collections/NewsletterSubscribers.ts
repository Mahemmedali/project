import type { CollectionConfig } from 'payload'
import { isAdminOrEditor, noOne } from '@/access'

export const NewsletterSubscribers: CollectionConfig = {
  slug: 'newsletter-subscribers',
  labels: { singular: 'Abunəçi', plural: 'Bülleten abunəçiləri' },
  admin: { useAsTitle: 'email', group: 'Bülleten', defaultColumns: ['email', 'locale', 'status', 'confirmedAt', 'source'] },
  access: { read: isAdminOrEditor, create: noOne, update: isAdminOrEditor, delete: isAdminOrEditor },
  fields: [
    { name: 'email', label: 'E-poçt', type: 'email', required: true, unique: true, index: true },
    {
      name: 'locale',
      label: 'Dil',
      type: 'select',
      defaultValue: 'az',
      options: [
        { label: 'AZ', value: 'az' },
        { label: 'EN', value: 'en' },
        { label: 'RU', value: 'ru' },
      ],
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      defaultValue: 'pending',
      index: true,
      options: [
        { label: 'Təsdiq gözləyir', value: 'pending' },
        { label: 'Təsdiqlənib', value: 'confirmed' },
        { label: 'İmtina edib', value: 'unsubscribed' },
      ],
    },
    { name: 'confirmedAt', label: 'Təsdiq tarixi', type: 'date' },
    { name: 'source', label: 'Mənbə', type: 'text', admin: { description: 'footer / sidebar / bulleten səhifəsi' } },
    { name: 'token', type: 'text', admin: { hidden: true }, index: true },
  ],
  timestamps: true,
}
