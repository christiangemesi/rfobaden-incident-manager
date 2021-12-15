import Model from '@/models/base/Model'
import User from '@/models/User'
import Id from '@/models/base/Id'
import Report from '@/models/Report'
import Incident from '@/models/Incident'
import { parseDate } from '@/models/Date'
import Priority from '@/models/Priority'
import Task from '@/models/Task'

export default interface Subtask extends Model {
    title: string
    description: string | null
    priority: Priority

    assigneeId: Id<User> | null

    closedAt: Date | null

    startsAt: Date | null
    endsAt: Date | null

    taskId: Id<Task>
    reportId: Id<Report>
    incidentId: Id<Incident>
}

export const parseSubtask = (data: Subtask): Subtask => ({
  ...data,
  createdAt: parseDate(data.createdAt),
  updatedAt: parseDate(data.updatedAt),
  startsAt: parseDateOrNull(data.startsAt),
  endsAt: parseDateOrNull(data.endsAt),
})

const parseDateOrNull = (date: Date | null): Date | null => {
  return date === null ? null : parseDate(date)
}

