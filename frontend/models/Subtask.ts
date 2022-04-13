import Model from '@/models/base/Model'
import Id from '@/models/base/Id'
import Report from '@/models/Report'
import Incident from '@/models/Incident'
import { parseDateOrNull } from '@/models/base/Date'
import Task from '@/models/Task'
import { FileId } from '@/models/FileUpload'
import Trackable, { parseTrackable } from '@/models/Trackable'

export default interface Subtask extends Model, Trackable {
  taskId: Id<Task>
  reportId: Id<Report>
  incidentId: Id<Incident>
  imageIds: FileId[]
}

export const parseSubtask = (data: Subtask): Subtask => ({
  ...data,
  ...parseTrackable(data),
  startsAt: parseDateOrNull(data.startsAt),
  endsAt: parseDateOrNull(data.endsAt),
})

export interface OpenedSubtask extends Subtask {
  isClosed: false
}

export const isOpenedSubtask = (subtask: Subtask): subtask is OpenedSubtask =>
  !subtask.isClosed