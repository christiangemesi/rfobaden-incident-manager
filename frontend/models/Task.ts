import Model from '@/models/base/Model'
import User from '@/models/User'
import Id from '@/models/base/Id'
import Report from '@/models/Report'
import Incident from '@/models/Incident'
import { parseDate } from '@/models/Date'
import Priority from '@/models/Priority'
import Subtask from '@/models/Subtask'

export default interface Task extends Model {
  title: string
  description: string | null
  priority: Priority
  location: string | null

  assigneeId: Id<User> | null

  createdAt: Date
  updatedAt: Date
  closedAt: Date | null

  startsAt: Date | null
  endsAt: Date | null

  reportId: Id<Report>
  incidentId: Id<Incident>

  closedSubtaskIds: Id<Subtask>[]
  subtaskIds: Id<Subtask>[]
  isDone: boolean
  isClosed: boolean
}

export const parseTask = (data: Task): Task => ({
  ...data,
  createdAt: parseDate(data.createdAt),
  updatedAt: parseDate(data.updatedAt),
  startsAt: parseDateOrNull(data.startsAt),
  endsAt: parseDateOrNull(data.endsAt),
})

const parseDateOrNull = (date: Date | null): Date | null => {
  return date === null ? null : parseDate(date)
}

