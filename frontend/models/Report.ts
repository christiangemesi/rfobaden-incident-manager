import Model from '@/models/base/Model'
import Incident from '@/models/Incident'
import Id from '@/models/base/Id'
import Task from '@/models/Task'
import { FileId } from '@/models/FileUpload'
import Trackable, { parseTrackable } from '@/models/Trackable'
import EntryType, { parseEntryType } from './EntryType'

export default interface Report extends Model, Trackable {
  notes: string | null
  location: string | null
  isDone: boolean
  entryType: EntryType
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
  entryType: parseEntryType(data.entryType),
})
