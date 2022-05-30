import { createModelStore } from '@/stores/base/Store'
import Task from '@/models/Task'
import Id from '@/models/base/Id'
import Subtask, { parseSubtask } from '@/models/Subtask'
import { createUseRecord, createUseRecords } from '@/stores/base/hooks'
import { getPriorityIndex } from '@/models/Priority'

const SubtaskStore = createModelStore(parseSubtask, {
  sortBy: (subtask) => [
    // Closed subtasks are always at the bottom.
    [subtask.isClosed, 'asc'],

    // Sort order: > priority > start date
    getPriorityIndex(subtask.priority),
    [subtask.startsAt ?? subtask.createdAt, 'asc'],
    subtask.id,
  ],
})
export default SubtaskStore

export const useSubtask = createUseRecord(SubtaskStore)
export const useSubtasks = createUseRecords(SubtaskStore)

export const useSubtasksOfTask = (taskId: Id<Task>): Subtask[] => (
  useSubtasks((subtasks) => (
    subtasks.filter((subtask) => subtask.taskId === taskId)
  ), [taskId])
)
