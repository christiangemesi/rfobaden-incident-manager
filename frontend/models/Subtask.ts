import Model from '@/models/base/Model'
import Id from '@/models/base/Id'
import Report from '@/models/Report'
import { parseDateOrNull } from '@/models/base/Date'
import Task from '@/models/Task'
import Document from '@/models/Document'
import Trackable, { parseTrackable } from '@/models/Trackable'

/**
 * `Subtask` represents a subtask, which is pat of a {@link Task}.
 */
export default interface Subtask extends Model, Trackable {
  /**
   * The {@link Task}'s id the subtask belongs to.
   */
  taskId: Id<Task>

  /**
   * The {@link Report}'s id the subtask belongs to.
   */
  reportId: Id<Report>

  /**
   * The images attached to the subtask, stored as {@link Document} instances.
   */
  images: Document[]

  /**
   * The {@link Document documents} attached to the subtask.
   * Does not include the entity's {@link #images image documents}.
   */
  documents: Document[]
}

/**
 * Parses a subtask's JSON structure.
 *
 * @param data The subtask to parse.
 * @return The parsed subtask.
 */
export const parseSubtask = (data: Subtask): Subtask => ({
  ...data,
  ...parseTrackable(data),
  startsAt: parseDateOrNull(data.startsAt),
  endsAt: parseDateOrNull(data.endsAt),
})

/**
 * `OpenSubtask` represents a subtask that is not {@link Subtask.isClosed closed}.
 */
export interface OpenSubtask extends Subtask {
  isClosed: false
}

/**
 * Checks if a subtask is an instance of {@link OpenSubtask}.
 *
 * @param subtask The subtask.
 * @return Whether the subtask is a {@link OpenSubtask}.
 */
export const isOpenSubtask = (subtask: Subtask): subtask is OpenSubtask =>
  !subtask.isClosed
