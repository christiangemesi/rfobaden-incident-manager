import Model from '@/models/base/Model'
import { parseDate } from '@/models/Date'

export default interface Incident extends Model {
    title: string
    authorId: number
    description: string | null
    closeReason: string | null
    isClosed: boolean
    createdAt: Date
    updatedAt: Date
    startsAt: Date | null
    endsAt: Date | null
    closedAt: Date | null
}

export const parseIncident = (data: unknown): Incident => {
  const incident = data as Incident
  return {
    ...incident,
    createdAt: parseDate(incident.createdAt),
    updatedAt: parseDate(incident.updatedAt),
    startsAt: parseDateOrNull(incident.startsAt),
    endsAt: parseDateOrNull(incident.endsAt),
    closedAt: parseDateOrNull(incident.closedAt),
  }
}

const parseDateOrNull = (date: Date | null): Date | null => {
  return date === null ? null : parseDate(date)
}