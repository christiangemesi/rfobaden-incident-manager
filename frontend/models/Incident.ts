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

  numberClosedReports: number
  numberReports: number
}

export const parseIncident = (data: Incident): Incident => {
  return {
    ...data,
    createdAt: parseDate(data.createdAt),
    updatedAt: parseDate(data.updatedAt),
    startsAt: parseDateOrNull(data.startsAt),
    endsAt: parseDateOrNull(data.endsAt),
    closeReason: data.closeReason && parseCloseReason(data.closeReason),
  }
}

const parseDateOrNull = (date: Date | null): Date | null => {
  return date === null ? null : parseDate(date)
}


export interface ClosedIncident extends Incident {
  closeReason: CloseReason
  isClosed: true
}

export const isClosedIncident = (incident: Incident): incident is ClosedIncident => (
  incident.isClosed && incident.closeReason !== null
)
