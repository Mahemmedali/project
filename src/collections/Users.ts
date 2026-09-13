import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminField, selfOrAdmin } from '@/access'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'İstifadəçi', plural: 'İstifadəçilər' },
  admin: { useAsTitle: 'name', group: 'Sistem', defaultColumns: ['name', 'email', 'roles'] },
  auth: { tokenExpiration: 60 * 60 * 24 * 7, maxLoginAttempts: 5, lockTime: 10 * 60 * 1000 },
  access: { read: selfOrAdmin, create: isAdmin, update: selfOrAdmin, delete: isAdmin, admin: ({ req }) => Boolean(req.user) },
  fields: [
    { name: 'name', label: 'Ad', type: 'text', required: true },
    {
      name: 'roles',
      label: 'Rollar',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['author'],
      access: { create: isAdminField, update: isAdminField },
      options: [
        { label: 'Admin — hər şey', value: 'admin' },
        { label: 'Redaktor — məqalə/dərc, kateqoriya, bülleten', value: 'editor' },
        { label: 'Müəllif — yalnız öz məqalələri (dərc edə bilmir)', value: 'author' },
        { label: 'Satış — tərəfdaşlar, reklam, sorğular', value: 'sales' },
      ],
    },
  ],
}
