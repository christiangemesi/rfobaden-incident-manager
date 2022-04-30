import Model from '@/models/base/Model'
import { parseDate } from '@/models/base/Date'
import User from '@/models/User'
import Id from '@/models/base/Id'
import BackendService, { BackendResponse } from '@/services/BackendService'

export default interface Organization extends Model {
  name: string
  userIds: Id<User>[]
}

export const parseOrganization = (data: Organization): Organization => ({
  ...data,
  createdAt: parseDate(data.createdAt),
  updatedAt: parseDate(data.updatedAt),
})

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