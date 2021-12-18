import { createModelStore } from '@/stores/Store'
import Task from '@/models/Task'
import Id from '@/models/base/Id'
import Subtask, { parseSubtask } from '@/models/Subtask'

const [SubtaskStore, useSubtasks, useSubtask] = createModelStore(parseSubtask)
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
