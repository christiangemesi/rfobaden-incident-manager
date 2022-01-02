import Model from '@/models/base/Model'
import { parseDate } from '@/models/Date'
import User from '@/models/User'
import Id from '@/models/base/Id'

export default interface Organization extends Model{
  name: string
  email: string
  userIds: Id<User>[]
}

export const parseOrganization = (data: Organization): Organization => ({
  ...data,
  createdAt: parseDate(data.createdAt),
  updatedAt: parseDate(data.updatedAt),
})