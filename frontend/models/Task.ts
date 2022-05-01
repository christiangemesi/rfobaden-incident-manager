import Model from '@/models/base/Model'
import Id from '@/models/base/Id'
import Report from '@/models/Report'
import Incident from '@/models/Incident'
import { parseDateOrNull } from '@/models/base/Date'
import Subtask from '@/models/Subtask'
import { FileId } from '@/models/FileUpload'
import Trackable, { parseTrackable } from '@/models/Trackable'

export default interface Task extends Model, Trackable {
  location: string | null
  isDone: boolean
  reportId: Id<Report>
  incidentId: Id<Incident>
  subtaskIds: Id<Subtask>[]
  closedSubtaskIds: Id<Subtask>[]
  imageIds: FileId[]
  documentIds: FileId[]
}

export const parseTask = (data: Task): Task => ({
  ...data,
  ...parseTrackable(data),
  startsAt: parseDateOrNull(data.startsAt),
  endsAt: parseDateOrNull(data.endsAt),
})

export interface OpenTask extends Task {
  isClosed: false
  isDone: false
}

export const isOpenTask = (task: Task): task is OpenTask =>
  !task.isClosed && !task.isDone
