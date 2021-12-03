import Model from '@/models/base/Model'
import { parseDate } from '@/models/Date'
import Incident from '@/models/Incident'
import User from '@/models/User'
import Id from '@/models/base/Id'
import Completable, { parseCompletable } from '@/models/Completable'
import Priority from '@/models/Priority'


export default interface Report extends Model, Completable {
  id: number
  title: string
  description: string | null
  addendum: string | null

  location: string | null
  priority: Priority

  incidentId: Id<Incident>
  authorId: Id<User>
  assigneeId: Id<User> | null

  startsAt: Date | null
  endsAt: Date | null

  createdAt: Date
  updatedAt: Date

  isKeyReport: boolean
  isLocationRelevant: boolean
}

export const parseReport = (data: Report): Report => ({
  ...data,
  ...parseCompletable(data),
  createdAt: parseDate(data.createdAt),
  updatedAt: parseDate(data.updatedAt),
  startsAt: parseDateOrNull(data.startsAt),
  endsAt: parseDateOrNull(data.endsAt),
})

const parseDateOrNull = (date: Date | null): Date | null => {
  return date === null ? null : parseDate(date)
}
