import Model from '@/models/base/Model'
import { parseDate } from '@/models/Date'

export default interface Organization extends Model{
  name: string
  email: string
  userIds: number[]
}

export const parseOrganization = (data: Organization): Organization => ({
  ...data,
  createdAt: parseDate(data.createdAt),
  updatedAt: parseDate(data.updatedAt),
})