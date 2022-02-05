import { createModelStore } from '@/stores/Store'
import Task, { parseTask } from '@/models/Task'
import Report from '@/models/Report'
import Id from '@/models/base/Id'
import SubtaskStore from '@/stores/SubtaskStore'

const [TaskStore, useTasks, useTask] = createModelStore(parseTask)
export default TaskStore

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
    isClosed: (
      subtask.isClosed
        ? [...new Set([...task.subtaskIds, subtask.id])] === [...new Set([...task.closedSubtaskIds, subtask.id])]
        : false
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
    isClosed: (
      subtask.isClosed
        ? task.subtaskIds === [...new Set([...task.closedSubtaskIds, subtask.id])]
        : false
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
    isClosed: subtaskIds === closedSubtaskIds,
  })
})

export {
  useTasks,
  useTask,
}

export const useTasksOfReport = (reportId: Id<Report>): Task[] => (
  useTasks((tasks) => (
    tasks.filter((task) => task.reportId === reportId)
  ), [reportId])
)
