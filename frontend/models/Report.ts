import Model from '@/models/base/Model'
import { parseDate } from '@/models/Date'
import Incident from '@/models/Incident'
import User from '@/models/User'
import Id from '@/models/base/Id'
import Priority from '@/models/Priority'
import Task from '@/models/Task'
import { FileId } from '@/models/FileUpload'


export default interface Report extends Model {
  id: number
  title: string
  description: string | null
  notes: string | null

  location: string | null
  priority: Priority

  incidentId: Id<Incident>
  assigneeId: Id<User> | null

  startsAt: Date | null
  endsAt: Date | null

  createdAt: Date
  updatedAt: Date

  isKeyReport: boolean
  isLocationRelevantReport: boolean

  closedTaskIds: Id<Task>[]
  taskIds: Id<Task>[]
  isDone: boolean
  isClosed: boolean

  imageIds: FileId[]
}

export const parseReport = (data: Report): Report => ({
  ...data,
  createdAt: parseDate(data.createdAt),
  updatedAt: parseDate(data.updatedAt),
  startsAt: parseDateOrNull(data.startsAt),
  endsAt: parseDateOrNull(data.endsAt),
})

const parseDateOrNull = (date: Date | null): Date | null => {
  return date === null ? null : parseDate(date)
}