import Model from '@/models/base/Model'
import Incident from '@/models/Incident'
import Id from '@/models/base/Id'
import Task from '@/models/Task'
import { FileId } from '@/models/FileUpload'
import Trackable, { parseTrackable } from '@/models/Trackable'


export default interface Report extends Model, Trackable {
  notes: string | null
  location: string | null
  isDone: boolean

  incidentId: Id<Incident>

  isKeyReport: boolean
  isLocationRelevantReport: boolean

  closedTaskIds: Id<Task>[]
  taskIds: Id<Task>[]

  imageIds: FileId[]
}

export const parseReport = (data: Report): Report => ({
  ...data,
  ...parseTrackable(data),
})

export interface OpenedReport extends Report {
  isClosed: false
  isDone: false
}

export const isOpenedReport = (report: Report): report is OpenedReport =>
  !report.isClosed && !report.isDone
