import Model from '@/models/base/Model'
import Incident from '@/models/Incident'
import Id from '@/models/base/Id'
import Task from '@/models/Task'
import Document from '@/models/Document'
import Trackable, { parseTrackable } from '@/models/Trackable'
import EntryType, { parseEntryType } from './EntryType'

/**
 * `Report` represents a report handled in an {@link Incident}.
 * It can be further divided into {@link Task tasks}.
 */
export default interface Report extends Model, Trackable {
  /**
   * Additional information about the report.
   */
  notes: string | null

  /**
   * The name of the location at which the report takes place.
   */
  location: string | null

  /**
   * Whether the report is done.
   * A report is done when all its {@link Task tasks} are all closed or done.
   */
  isDone: boolean

  /**
   * The way the report was received.
   */
  entryType: EntryType

  /**
   * The {@link Incident} id the report belongs to.
   */
  incidentId: Id<Incident>

  /**
   * Whether the report is one of the currently most important reports
   * of its {@link #incident Incident}.
   */
  isKeyReport: boolean

  /**
   * Whether the report affects its location, making it important to
   * other reports happening in the same place.
   */
  isLocationRelevantReport: boolean

  /**
   * List of all closed {@link Task} ids.
   */
  closedTaskIds: Id<Task>[]

  /**
   * List of all {@link Task} ids.
   */
  taskIds: Id<Task>[]

  /**
   * The images attached to the report, stored as document instances.
   */
  images: Document[]

  /**
   * The documents attached to the report.
   * Does not include the entity's {@link images image documents}.
   */
  documents: Document[]
}

/**
 * Parses a report's JSON structure.
 *
 * @param data The report to parse.
 * @return The parsed report.
 */
export const parseReport = (data: Report): Report => ({
  ...data,
  ...parseTrackable(data),
  entryType: parseEntryType(data.entryType),
})

/**
 * `OpenReport` represents a report that's neither
 * {@link Report.isClosed closed} nor {@link Report.isDone done}.
 */
export interface OpenReport extends Report {
  isClosed: false
  isDone: false
}

/**
 * Checks if a report is an instance of {@link OpenReport}.
 * 
 * @param report The report.
 * @return Whether the report is a {@link OpenReport}.
 */
export const isOpenReport = (report: Report): report is OpenReport => !report.isClosed && !report.isDone
