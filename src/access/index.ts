import type { Access, FieldAccess } from 'payload'
import type { User } from '@/payload-types'

export type Role = 'admin' | 'editor' | 'author' | 'sales'

type AnyUser = { roles?: string[] | null; id?: number | string } | null | undefined

export const hasRole = (user: AnyUser, ...roles: Role[]) =>
  Boolean(user?.roles?.some((r) => (roles as string[]).includes(r)))

export const isStaff = (user: AnyUser) => hasRole(user, 'admin', 'editor', 'author', 'sales')

export const anyone: Access = () => true
export const noOne: Access = () => false
export const isAdmin: Access = ({ req }) => hasRole(req.user, 'admin')
export const isAdminField: FieldAccess = ({ req }) => hasRole(req.user, 'admin')
export const isAdminOrEditor: Access = ({ req }) => hasRole(req.user, 'admin', 'editor')
export const isAdminOrSales: Access = ({ req }) => hasRole(req.user, 'admin', 'sales')
export const isLoggedIn: Access = ({ req }) => Boolean(req.user)

/** Dərc olunmuşları hamı, qaralamaları yalnız heyət görür */
export const publishedOrStaff: Access = ({ req }) => {
  if (isStaff(req.user)) return true
  return { _status: { equals: 'published' } }
}

/** Məqalə: admin/editor hamısını, author yalnız özününkünü redaktə edir */
export const articleUpdate: Access = ({ req }) => {
  if (hasRole(req.user, 'admin', 'editor')) return true
  if (hasRole(req.user, 'author')) return { createdBy: { equals: (req.user as User).id } }
  return false
}

export const articleCreate: Access = ({ req }) => hasRole(req.user, 'admin', 'editor', 'author')

/** İstifadəçi öz profilini oxuya/redaktə edə bilər; admin hamısını */
export const selfOrAdmin: Access = ({ req }) => {
  if (hasRole(req.user, 'admin')) return true
  if (req.user) return { id: { equals: req.user.id } }
  return false
}
