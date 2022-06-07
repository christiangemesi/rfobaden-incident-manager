import Model from '@/models/base/Model'
import Id from '@/models/base/Id'
import Report from '@/models/Report'
import { parseDateOrNull } from '@/models/base/Date'
import Subtask from '@/models/Subtask'
import Document from '@/models/Document'
import Trackable, { parseTrackable } from '@/models/Trackable'

/**
 * `Task` represents a task handled in an {@link Report}.
 * It can be further divided into {@link Subtask subtasks}.
 */
export default interface Task extends Model, Trackable {
  /**
   * The location at which the task takes place.
   */
  location: string | null

  /**
   * Whether the task is done.
   * A task is done when all its {@link Subtask subtasks} are all closed or done.
   */
  isDone: boolean

  /**
   * The {@link Report}'s id the task belongs to.
   */
  reportId: Id<Report>

  /**
   * The {@link Subtask subtasks}' ids of the task.
   */
  subtaskIds: Id<Subtask>[]

  /**
   * The closed {@link Subtask subtasks}' ids of the task.
   */
  closedSubtaskIds: Id<Subtask>[]

  /**
   * The images attached to the task, stored as {@link Document} instances.
   */
  images: Document[]

  /**
   * The {@link Document documents} attached to the task.
   * Does not include the entity's {@link #images image documents}.
   */
  documents: Document[]
}

/**
 * Parses a task's JSON structure.
 *
 * @param data The task to parse.
 * @return The parsed task.
 */
export const parseTask = (data: Task): Task => ({
  ...data,
  ...parseTrackable(data),
  startsAt: parseDateOrNull(data.startsAt),
  endsAt: parseDateOrNull(data.endsAt),
})

/**
 * `OpenTask` represents a task that is neither
 * {@link Task.isClosed closed} nor {@link Task.isDone done}.
 */
export interface OpenTask extends Task {
  isClosed: false
  isDone: false
}

/**
 * Checks if a task is an instance of {@link OpenTask}.
 *
 * @param task The task.
 * @return Whether the task is a {@link OpenTask}.
 */
export const isOpenTask = (task: Task): task is OpenTask =>
  !task.isClosed && !task.isDone
