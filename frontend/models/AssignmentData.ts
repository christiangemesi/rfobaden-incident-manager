import Task from '@/models/Task'
import Transport from '@/models/Transport'
import Subtask from '@/models/Subtask'
import Report from '@/models/Report'
import Priority from './Priority'
import Trackable from '@/models/Trackable'
import User from '@/models/User'

/**
 * `AssignmentData` represents an assignment containing all entities
 * assigned to a specific {@link User user} which belong to a
 * not closed {@link Incident}.
 */
export default interface AssignmentData {
  /**
   * List of assigned {@link Transport transports}.
   */
  transports: Transport[]

  /**
   * List of assigned {@link Report reports}.
   */
  reports: Report[]

  /**
   * List of assigned {@link Task tasks}.
   */
  tasks: Task[]

  /**
   * List of assigned {@link Subtask subtasks}.
   */
  subtasks: Subtask[]
}

/**
 * Priorities of assignments.
 */
type Prioritized<T> = {
  [K in Priority]: T[]
} & {
  closed: T[]
}

/**
 * Group all entities by their priorities and filter them by the assigned user.
 *
 * @param currentUser The logged-in user.
 * @param isOpen A function checking the close state of the entity.
 */
export const groupAssigned = <T extends Trackable>(currentUser: User, isOpen: (record: T) => boolean) => (records: readonly T[]): Prioritized<T> => {
  const result: Prioritized<T> = {
    [Priority.HIGH]: [],
    [Priority.MEDIUM]: [],
    [Priority.LOW]: [],
    closed: [],
  }

  // Group the entity to the correct priority
  for (const record of records) {
    if (record.assigneeId !== currentUser.id) {
      continue
    }
    if (!isOpen(record)) {
      result.closed.push(record)
      continue
    }
    result[record.priority].push(record)
  }
  return result
}
