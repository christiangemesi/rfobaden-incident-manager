import Model, { parseModel } from '@/models/base/Model'
import { useMemo } from 'react'
import Organization from '@/models/Organization'
import Id from '@/models/base/Id'

export default interface User extends Model {
  email: string
  firstName: string
  lastName: string
  role: UserRole
  organizationId: Id<Organization> | null
}

export enum UserRole {
  AGENT = 'AGENT',
  ADMIN = 'ADMIN',
}

export const parseUser = (data: unknown): User => {
  const user = data as User
  return {
    ...user,
    ...parseModel(data),
  }
}

export const useUsername = (user: User | null): string | null => {
  return useMemo(() => (
    (user === null) ? null : `${user.firstName} ${user.lastName}`
  ), [user])
}

export const isAgent = (user: User): boolean => (
  user.role === UserRole.AGENT
)

export const isAdmin = (user: User): boolean => (
  user.role === UserRole.ADMIN
)
