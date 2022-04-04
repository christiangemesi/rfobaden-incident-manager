import Model from '@/models/base/Model'
import { parseDate } from '@/models/Date'
import Incident from '@/models/Incident'
import User from '@/models/User'
import Priority from '@/models/Priority'
import Id from '@/models/base/Id'

export default interface Transport extends Model {
  title: string
  description: string | null

  priority: Priority

  peopleInvolved: number
  driver: string | null
  vehicle: string | null
  trailer: string | null
  pointOfDeparture: string | null
  pointOfArrival: string | null

  startsAt: Date | null
  endsAt: Date | null
  isClosed: boolean

  incidentId: Id<Incident>
  assigneeId: Id<User> | null
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
