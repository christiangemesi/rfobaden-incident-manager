import { createModelStore } from '@/stores/Store'
import Task from '@/models/Task'
import Id from '@/models/base/Id'
import Subtask, { parseSubtask } from '@/models/Subtask'
import TaskStore from '@/stores/TaskStore'

const [SubtaskStore, useSubtasks, useSubtask] = createModelStore(parseSubtask)
export default SubtaskStore

SubtaskStore.onCreate((subtask) => {
  const task = TaskStore.find(subtask.taskId)
  if (task === null) {
    return
  }
  TaskStore.save({
    ...task,
    subtaskIds: [...new Set([...task.subtaskIds, subtask.id])],
    closedSubtaskIds: (
      subtask.isClosed
        ? [...new Set([...task.closedSubtaskIds, subtask.id])]
        : task.subtaskIds
    ),
  })
})
SubtaskStore.onUpdate((subtask, oldSubtask) => {
  const task = TaskStore.find(subtask.taskId)
  if (task === null || subtask.isClosed === oldSubtask.isClosed) {
    return
  }
  const closedSubtaskIds = [...task.closedSubtaskIds]
  closedSubtaskIds.splice(closedSubtaskIds.indexOf(subtask.id), 1)
  TaskStore.save({
    ...task,
    closedSubtaskIds: (
      subtask.isClosed
        ? [...new Set([...task.closedSubtaskIds, subtask.id])]
        : closedSubtaskIds
    ),
  })
})
SubtaskStore.onRemove((subtask) => {
  const task = TaskStore.find(subtask.taskId)
  if (task === null) {
    return
  }
  const subtaskIds = [...task.subtaskIds]
  subtaskIds.splice(subtaskIds.indexOf(subtask.id), 1)
  const closedSubtaskIds = [...task.closedSubtaskIds]
  if (subtask.isClosed) {
    closedSubtaskIds.splice(closedSubtaskIds.indexOf(subtask.id), 1)
  }
  TaskStore.save({
    ...task,
    subtaskIds,
    closedSubtaskIds,
  })
})

export {
  useSubtasks,
  useSubtask,
}

export const useSubtasksOfTask = (taskId: Id<Task>): Subtask[] => (
  useSubtasks((subtasks) => (
    subtasks.filter((subtask) => subtask.taskId === taskId)
  ), [taskId])
)
