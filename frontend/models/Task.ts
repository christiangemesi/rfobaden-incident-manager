import Model from '@/models/base/Model'
import User from '@/models/User'
import Id from '@/models/base/Id'
import Report from '@/models/Report'
import Incident from '@/models/Incident'
import { parseDate } from '@/models/Date'

export default interface Task extends Model {
    title: string
    description: string | null
    priority: string
    location: string | null

    assigneeId: Id<User> | null

    createdAt: Date
    updatedAt: Date
    closedAt: Date | null

    startsAt: Date | null
    endsAt: Date | null

    reportId: Id<Report>
    incidentId: Id<Incident>

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

export enum TaskPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
}
