import Model from '@/models/base/Model'
import Id from '@/models/base/Id'
import User from '@/models/User'
import Incident from './Incident'
import { parseDate } from './Date'

export default interface Report extends Model {
  title: string
  description: string | null
  incident: Incident
  authorId: Id<User>
  assigneeId: Id<User>
  createdAt: Date
  updatedAt: Date
}

export const parseReport = (data: unknown): Report => {
  const report = data as Report
  return {
    ...report,
    createdAt: parseDate(report.createdAt),
    updatedAt: parseDate(report.updatedAt),
  }
}