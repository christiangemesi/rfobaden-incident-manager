import Task from '@/models/Task'
import Transport from '@/models/Transport'
import Subtask from '@/models/Subtask'
import Report from '@/models/Report'
import Trackable from '@/models/Trackable'
import User from '@/models/User'
import Priority from '@/models/Priority'

export default interface AssignmentData {
  transports: Transport[]
  reports: Report[]
  tasks: Task[]
  subtasks: Subtask[]
}

type Prioritized<T> = {
  [K in Priority]: T[]
} & {
  closed: T[]
}

export const groupAssigned = <T extends Trackable>(currentUser: User, isOpen: (record: T) => boolean) => (records: readonly T[]): Prioritized<T> => {
  const result: Prioritized<T> = {
    [Priority.HIGH]: [],
    [Priority.MEDIUM]: [],
    [Priority.LOW]: [],
    closed: [],
  }
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