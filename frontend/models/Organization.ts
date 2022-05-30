import Model from '@/models/base/Model'
import { parseDate } from '@/models/base/Date'
import User from '@/models/User'
import Id from '@/models/base/Id'
import BackendService, { BackendResponse } from '@/services/BackendService'

/**
 * `Organization` represents an organization to which {@link User users} can belong.
 */
export default interface Organization extends Model {
  /**
   * The name of the organization.
   */
  name: string

  /**
   * The users' ids which belong to the organization.
   */
  userIds: Id<User>[]
}

/**
 * Parses an organization's JSON structure.
 *
 * @param data The organization to parse.
 * @return The parsed organization.
 */
export const parseOrganization = (data: Organization): Organization => ({
  ...data,
  createdAt: parseDate(data.createdAt),
  updatedAt: parseDate(data.updatedAt),
})

/**
 * Gets the name of an organization by its id.
 *
 * @param organizationId The organization's id.
 * @return The organization's name.
 */
export const getOrganizationName = async (organizationId: Id<Organization> | null): Promise<string> => {
  if (organizationId === null) {
    return ''
  }

  const [organization, organizationError]: BackendResponse<Organization> = await BackendService.find(
    `organizations/${organizationId}`,
  )
  if (organizationError !== null) {
    throw organizationError
  }

  return organization.name
}
