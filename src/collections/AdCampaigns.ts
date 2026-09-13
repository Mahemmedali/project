import type { CollectionConfig } from 'payload'
import { anyone, isAdminOrSales } from '@/access'
import { revalidateAll } from '@/hooks/revalidate'

export const AdCampaigns: CollectionConfig = {
  slug: 'ad-campaigns',
  labels: { singular: 'Reklam kampaniyası', plural: 'Reklam kampaniyaları' },
  admin: { useAsTitle: 'name', group: 'B2B', defaultColumns: ['name', 'partner', 'slot', 'active', 'startAt', 'endAt'] },
  access: { read: anyone, create: isAdminOrSales, update: isAdminOrSales, delete: isAdminOrSales },
  hooks: { afterChange: [revalidateAll] },
  fields: [
    { name: 'name', label: 'Kampaniya adı', type: 'text', required: true },
    { name: 'partner', label: 'Tərəfdaş', type: 'relationship', relationTo: 'partners', required: true },
    { name: 'slot', label: 'Slot', type: 'relationship', relationTo: 'ad-slots', required: true },
    { name: 'active', label: 'Aktiv', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
    {
      type: 'row',
      fields: [
        { name: 'startAt', label: 'Başlanğıc', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' } } },
        { name: 'endAt', label: 'Bitmə', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' } } },
      ],
    },
    {
      name: 'targetLocales',
      label: 'Dillər',
      type: 'select',
      hasMany: true,
      defaultValue: ['az', 'en', 'ru'],
      options: [
        { label: 'AZ', value: 'az' },
        { label: 'EN', value: 'en' },
        { label: 'RU', value: 'ru' },
      ],
    },
    {
      name: 'creativeType',
      label: 'Kreativ növü',
      type: 'radio',
      defaultValue: 'image',
      options: [
        { label: 'Şəkil', value: 'image' },
        { label: 'HTML (sandbox iframe)', value: 'html' },
      ],
    },
    { name: 'creative', label: 'Kreativ (şəkil)', type: 'upload', relationTo: 'media', admin: { condition: (d) => d.creativeType === 'image' } },
    { name: 'html', label: 'HTML kreativ', type: 'code', admin: { language: 'html', condition: (d) => d.creativeType === 'html' } },
    { name: 'url', label: 'Keçid URL', type: 'text', required: true },
    { name: 'impressions', label: 'Göstərim', type: 'number', defaultValue: 0, admin: { readOnly: true, position: 'sidebar' } },
    { name: 'clicks', label: 'Klik', type: 'number', defaultValue: 0, admin: { readOnly: true, position: 'sidebar' } },
  ],
}
