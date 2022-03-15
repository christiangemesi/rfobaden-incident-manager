import { createModelStore } from '@/stores/base/Store'
import Task from '@/models/Task'
import Id from '@/models/base/Id'
import Subtask, { parseSubtask } from '@/models/Subtask'
import { createUseRecord, createUseRecords } from '@/stores/base/hooks'

const SubtaskStore = createModelStore(parseSubtask)

export default SubtaskStore

export const useSubtask = createUseRecord(SubtaskStore)
export const useSubtasks = createUseRecords(SubtaskStore)

export const useSubtasksOfTask = (taskId: Id<Task>): Subtask[] => (
  useSubtasks((subtasks) => (
    subtasks.filter((subtask) => subtask.taskId === taskId)
  ), [taskId])
)
