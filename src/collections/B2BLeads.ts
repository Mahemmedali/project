import type { CollectionConfig } from 'payload'
import { isAdminOrSales, noOne } from '@/access'

export const B2BLeads: CollectionConfig = {
  slug: 'b2b-leads',
  labels: { singular: 'Reklam sorğusu', plural: 'Reklam sorğuları' },
  admin: { useAsTitle: 'company', group: 'B2B', defaultColumns: ['company', 'contact', 'service', 'status', 'createdAt'] },
  access: { read: isAdminOrSales, create: noOne, update: isAdminOrSales, delete: isAdminOrSales },
  fields: [
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      defaultValue: 'new',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Yeni', value: 'new' },
        { label: 'Əlaqə saxlanılıb', value: 'contacted' },
        { label: 'Qazanılıb', value: 'won' },
        { label: 'İtirilib', value: 'lost' },
      ],
    },
    { name: 'company', label: 'Şirkət', type: 'text', required: true },
    { name: 'contact', label: 'Əlaqə şəxsi', type: 'text', required: true },
    { name: 'email', label: 'E-poçt', type: 'email', required: true },
    { name: 'phone', label: 'Telefon', type: 'text' },
    {
      name: 'service',
      label: 'Xidmət',
      type: 'select',
      required: true,
      options: [
        { label: 'Displey reklam', value: 'display' },
        { label: 'Nativ reklam', value: 'native' },
        { label: 'Sponsorlu məzmun', value: 'sponsored' },
        { label: 'Bülleten sponsorluğu', value: 'newsletter' },
        { label: 'Korporativ abunəlik', value: 'corporate' },
        { label: 'Tədbir tərəfdaşlığı', value: 'event' },
      ],
    },
    {
      name: 'budget',
      label: 'Büdcə (AZN)',
      type: 'select',
      options: [
        { label: '1 000-ə qədər', value: 'b1' },
        { label: '1 000 – 5 000', value: 'b2' },
        { label: '5 000 – 15 000', value: 'b3' },
        { label: '15 000+', value: 'b4' },
      ],
    },
    { name: 'message', label: 'Mesaj', type: 'textarea' },
    { name: 'locale', label: 'Dil', type: 'text', admin: { position: 'sidebar', readOnly: true } },
    { name: 'notes', label: 'Satış qeydləri', type: 'textarea' },
  ],
  timestamps: true,
}
