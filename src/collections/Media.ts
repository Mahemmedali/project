import type { CollectionConfig } from 'payload'
import { anyone, isLoggedIn } from '@/access'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Media', plural: 'Media' },
  admin: { group: 'Məzmun', defaultColumns: ['filename', 'alt', 'credit', 'updatedAt'] },
  access: { read: anyone, create: isLoggedIn, update: isLoggedIn, delete: isLoggedIn },
  upload: {
    staticDir: 'public/media',
    mimeTypes: ['image/*'],
    focalPoint: true,
    adminThumbnail: 'thumb',
    imageSizes: [
      { name: 'thumb', width: 400, height: 250, position: 'centre' },
      { name: 'card', width: 800, height: 500, position: 'centre' },
      { name: 'hero', width: 1600, height: 900, position: 'centre' },
      { name: 'og', width: 1200, height: 630, position: 'centre' },
    ],
  },
  fields: [
    { name: 'alt', label: 'Alt mətn', type: 'text', localized: true, required: true },
    { name: 'credit', label: 'Müəllif / mənbə', type: 'text', admin: { description: 'Foto müəllifi və ya agentlik — səhifədə göstərilir' } },
  ],
}
