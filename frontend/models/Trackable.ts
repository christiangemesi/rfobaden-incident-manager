import Model, { parseModel } from '@/models/base/Model'
import Priority from '@/models/Priority'
import Id from '@/models/base/Id'
import User from '@/models/User'
import { parseDateOrNull } from '@/models/base/Date'

export default interface Trackable extends Model {
  title: string
  description: string | null
  priority: Priority

  isClosed: boolean

  startsAt: Date | null
  endsAt: Date | null

  assigneeId: Id<User> | null
}

export const parseTrackable = (data: Trackable): Trackable => {
  return {
    ...data,
    ...parseModel(data),
    startsAt: parseDateOrNull(data.startsAt),
    endsAt: parseDateOrNull(data.endsAt),
  }
}
