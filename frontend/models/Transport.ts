import Model from '@/models/base/Model'
import { parseDate } from '@/models/Date'
import Incident from '@/models/Incident'
import User from '@/models/User'
import Priority from '@/models/Priority'
import Id from '@/models/base/Id'

export default interface Transport extends Model {
  id: number
  title: string
  description: string | null

  incidentId: Id<Incident>
  assigneeId: Id<User> | null

  priority: Priority

  peopleInvolved: string //TODO change to number
  driver: string | null
  vehicle: string | null
  trailer: string | null
  sourcePlace: string | null
  destinationPlace: string | null

  startsAt: Date | null
  endsAt: Date | null

  createdAt: Date
  updatedAt: Date

  isDone: boolean
  isClosed: boolean
}

export const parseTransport = (data: Transport): Transport => ({
  ...data,
  createdAt: parseDate(data.createdAt),
  updatedAt: parseDate(data.updatedAt),
  startsAt: parseDateOrNull(data.startsAt),
  endsAt: parseDateOrNull(data.endsAt),
})

const parseDateOrNull = (date: Date | null): Date | null => {
  return date === null ? null : parseDate(date)
}
