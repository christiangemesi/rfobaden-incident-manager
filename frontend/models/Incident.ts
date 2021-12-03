import Model from '@/models/base/Model'
import { parseDate } from '@/models/Date'
import CloseReason, { parseCloseReason } from '@/models/CloseReason'

export default interface Incident extends Model {
  title: string
  description: string | null
  startsAt: Date | null
  endsAt: Date | null
  closeReason: CloseReason | null
  isClosed: boolean
}

export const parseIncident = (data: unknown): Incident => {
  const incident = data as Incident
  return {
    ...incident,
    createdAt: parseDate(incident.createdAt),
    updatedAt: parseDate(incident.updatedAt),
    startsAt: parseDateOrNull(incident.startsAt),
    endsAt: parseDateOrNull(incident.endsAt),
    closeReason:  incident.closeReason && parseCloseReason(incident.closeReason),
  }
}

const parseDateOrNull = (date: Date | null): Date | null => {
  return date === null ? null : parseDate(date)
}