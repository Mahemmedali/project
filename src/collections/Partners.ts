import type { CollectionConfig } from 'payload'
import { anyone, isAdminOrSales } from '@/access'

export const Partners: CollectionConfig = {
  slug: 'partners',
  labels: { singular: 'Tərəfdaş', plural: 'Tərəfdaşlar' },
  admin: { useAsTitle: 'name', group: 'B2B', defaultColumns: ['name', 'type', 'website'] },
  access: { read: anyone, create: isAdminOrSales, update: isAdminOrSales, delete: isAdminOrSales },
  fields: [
    { name: 'name', label: 'Şirkət', type: 'text', required: true },
    { name: 'logo', label: 'Loqo', type: 'upload', relationTo: 'media' },
    { name: 'website', label: 'Sayt', type: 'text' },
    {
      name: 'type',
      label: 'Növ',
      type: 'select',
      required: true,
      defaultValue: 'advertiser',
      options: [
        { label: 'Reklamverən', value: 'advertiser' },
        { label: 'Sponsor', value: 'sponsor' },
      ],
    },
    { name: 'contact', label: 'Əlaqə', type: 'group', fields: [
      { name: 'name', label: 'Ad', type: 'text' },
      { name: 'email', label: 'E-poçt', type: 'email' },
      { name: 'phone', label: 'Telefon', type: 'text' },
    ] },
    { name: 'notes', label: 'Qeydlər', type: 'textarea' },
  ],
}
