import type { GlobalConfig } from 'payload'
import { anyone, isAdmin } from '@/access'
import { revalidateSettings } from '@/hooks/revalidate'

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Sayt parametrləri',
  admin: { group: 'Sistem' },
  access: { read: anyone, update: isAdmin },
  hooks: { afterChange: [revalidateSettings] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Ümumi',
          fields: [
            { name: 'siteName', label: 'Sayt adı', type: 'text', localized: true, defaultValue: 'Good Morning Baku' },
            { name: 'tagline', label: 'Şüar', type: 'text', localized: true },
            { name: 'tickerEnabled', label: 'Təcili xəbər zolağı aktiv', type: 'checkbox', defaultValue: true },
            {
              name: 'defaultSeo',
              label: 'Standart SEO',
              type: 'group',
              fields: [
                { name: 'title', label: 'Başlıq', type: 'text', localized: true },
                { name: 'description', label: 'Təsvir', type: 'textarea', localized: true },
                { name: 'image', label: 'OG şəkil', type: 'upload', relationTo: 'media' },
              ],
            },
          ],
        },
        {
          label: 'Hava',
          fields: [
            {
              name: 'weather',
              label: 'Hava (əl ilə; API v2-də)',
              type: 'group',
              fields: [
                { name: 'city', label: 'Şəhər', type: 'text', localized: true, defaultValue: 'Bakı' },
                { type: 'row', fields: [
                  { name: 'tempDay', label: 'Gündüz °C', type: 'number', defaultValue: 25 },
                  { name: 'tempNight', label: 'Gecə °C', type: 'number', defaultValue: 18 },
                ] },
                { name: 'condition', label: 'Vəziyyət', type: 'text', localized: true },
                { name: 'icon', label: 'İkon', type: 'select', defaultValue: 'sun', options: [
                  { label: 'Günəş', value: 'sun' }, { label: 'Bulud', value: 'cloud' }, { label: 'Yağış', value: 'rain' }, { label: 'Külək', value: 'wind' },
                ] },
              ],
            },
          ],
        },
        {
          label: 'Əlaqə və sosial',
          fields: [
            {
              name: 'contact',
              label: 'Əlaqə',
              type: 'group',
              fields: [
                { name: 'editorialEmail', label: 'Redaksiya e-poçt', type: 'email', defaultValue: 'redaksiya@goodmorningbaku.com' },
                { name: 'salesEmail', label: 'Reklam e-poçt', type: 'email', defaultValue: 'reklam@goodmorningbaku.com' },
                { name: 'phone', label: 'Telefon', type: 'text' },
                { name: 'address', label: 'Ünvan', type: 'text', localized: true },
              ],
            },
            {
              name: 'social',
              label: 'Sosial şəbəkələr',
              type: 'array',
              fields: [
                { name: 'network', label: 'Şəbəkə', type: 'select', required: true, options: ['instagram', 'telegram', 'facebook', 'youtube', 'x', 'linkedin', 'tiktok'].map((v) => ({ label: v, value: v })) },
                { name: 'url', label: 'URL', type: 'text', required: true },
              ],
            },
          ],
        },
      ],
    },
  ],
}
