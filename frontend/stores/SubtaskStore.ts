import { createModelStore } from '@/stores/Store'
import Task from '@/models/Task'
import Id from '@/models/base/Id'
import Subtask, { parseSubtask } from '@/models/Subtask'
import { getPriorityIndex } from '@/models/Priority'

const [SubtaskStore, useSubtasks, useSubtask] = createModelStore(parseSubtask, {}, {
  sortBy: (subtask) => ['desc', [
    [subtask.isClosed, 'asc'],
    getPriorityIndex(subtask.priority),
    [subtask.title.toLowerCase(), 'asc'],
  ]],
})
export default SubtaskStore

export {
  useSubtasks,
  useSubtask,
}

export const useSubtasksOfTask = (taskId: Id<Task>): Subtask[] => (
  useSubtasks((subtasks) => (
    subtasks.filter((subtask) => subtask.taskId === taskId)
  ), [taskId])
)
