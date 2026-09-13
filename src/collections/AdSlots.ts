import type { CollectionConfig } from 'payload'
import { anyone, isAdminOrSales } from '@/access'

export const AD_SLOT_KEYS = ['home_top', 'home_inline', 'sidebar', 'article_inline', 'article_bottom', 'category_top'] as const

export const AdSlots: CollectionConfig = {
  slug: 'ad-slots',
  labels: { singular: 'Reklam slotu', plural: 'Reklam slotları' },
  admin: { useAsTitle: 'key', group: 'B2B', defaultColumns: ['key', 'active', 'size'] },
  access: { read: anyone, create: isAdminOrSales, update: isAdminOrSales, delete: isAdminOrSales },
  fields: [
    {
      name: 'key',
      label: 'Açar (səhifədəki yer)',
      type: 'select',
      required: true,
      unique: true,
      options: AD_SLOT_KEYS.map((k) => ({ label: k, value: k })),
    },
    { name: 'active', label: 'Aktiv', type: 'checkbox', defaultValue: true },
    {
      name: 'size',
      label: 'Ölçü (masaüstü)',
      type: 'group',
      fields: [
        { name: 'w', label: 'En', type: 'number', required: true },
        { name: 'h', label: 'Hündürlük', type: 'number', required: true },
      ],
    },
    {
      name: 'mobileSize',
      label: 'Ölçü (mobil)',
      type: 'group',
      fields: [
        { name: 'w', label: 'En', type: 'number' },
        { name: 'h', label: 'Hündürlük', type: 'number' },
      ],
    },
  ],
}
