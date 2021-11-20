import Model from '@/models/base/Model'
import { parseDate } from '@/models/Date'
import Incident, { parseIncident } from '@/models/Incident'
import User from '@/models/User'


export default interface Report extends Model {
  id: number
  authorId: number
  assignedTo: User
  incident: Incident
  title: string
  description: string | null
  adendum: string | null
  createdAt: Date
  updatedAt: Date
  startsAt: Date | null
  closures: Set<Report>
  location: string | null
  //TODO change to Priority when possible
  priority: string | null
  closedAt: Date | null
  closeReason: string | null
  isClosed: boolean
  endsAt: Date | null

}

export const parseReport = (data: unknown): Report => {
  const report = data as Report
  return {
    ...report,
    createdAt: parseDate(report.createdAt),
    updatedAt: parseDate(report.updatedAt),
    startsAt: parseDateOrNull(report.startsAt),
    endsAt: parseDateOrNull(report.endsAt),
    incident: parseIncident(report.incident),
  }
}

const parseDateOrNull = (date: Date | null): Date | null => {
  return date === null ? null : parseDate(date)
}