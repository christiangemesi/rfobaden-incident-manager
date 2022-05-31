import Model, { parseModel } from '@/models/base/Model'
import { useMemo } from 'react'
import Organization from '@/models/Organization'
import Id from '@/models/base/Id'

/**
 * `User` represents a user of the IncidentManager application.
 */
export default interface User extends Model {
  /**
   * The user's email. Must be unique.
   */
  email: string

  /**
   * The user's first name.
   */
  firstName: string

  /**
   * The user's last name.
   */
  lastName: string

  /**
   * The user's role.
   */
  role: UserRole

  /**
   * The organization's id to which the user belongs.
   * Can be {@code null}.
   */
  organizationId: Id<Organization> | null
}

/**
 * `UserRole` defines the roles a user can have.
 * Users have differing levels of permission depending on their role.
 */
export enum UserRole {
  /**
   * The `AGENT` role gives users a basic permission level.
   * It is the role given to the majority of users.
   */
  AGENT = 'AGENT',

  /**
   * The `ADMIN` role gives users full access to all features.
   */
  ADMIN = 'ADMIN',
}

/**
 * Parses a report's JSON structure.
 *
 * @param data The report to parse.
 * @return The parsed report.
 */
export const parseUser = (data: User): User => {
  return {
    ...data,
    ...parseModel(data),
  }
}

/**
 * `useUsername` is a React hook which loads the username of a specific user from {@link UserStore}.
 * It re-renders whenever the user is changed.
 *
 * @param user The user.
 * @return The user's username.
 */
/**
 * `useUsername` is a React hook which builds the display name of a {@link User} 
 *
 * @param user The user.
 * @return The user's username.
 */
export const useUsername = (user: User | null): string | null => {
  return useMemo(() => (
    (user === null) ? null : `${user.firstName} ${user.lastName}`
  ), [user])
}

/**
 * Checks whether the user has the role of an `AGENT`.
 *
 * @param user The user.
 * @return Whether the user is an agent.
 */
export const isAgent = (user: User): boolean => (
  user.role === UserRole.AGENT
)

/**
 * Checks whether the user has the role of an `ADMIN`.
 *
 * @param user The user.
 * @return Whether the user is an admin.
 */
export const isAdmin = (user: User): boolean => (
  user.role === UserRole.ADMIN
)
