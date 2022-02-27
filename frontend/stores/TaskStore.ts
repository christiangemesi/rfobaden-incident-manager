import { createModelStore } from '@/stores/Store'
import Task, { parseTask } from '@/models/Task'
import Report from '@/models/Report'
import Id from '@/models/base/Id'
import SubtaskStore from '@/stores/SubtaskStore'
import { getPriorityIndex } from '@/models/Priority'

const [TaskStore, useTasks, useTask] = createModelStore(parseTask, {}, {
  sortBy: (task) => ['desc', [
    [task.isClosed || task.isDone, 'asc'],
    getPriorityIndex(task.priority),
    [task.title, 'asc'],
  ]],
})
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
        : task.closedSubtaskIds
    ),
    isDone: task.isDone && subtask.isClosed,
  })
})
SubtaskStore.onUpdate((subtask, oldSubtask) => {
  const task = TaskStore.find(subtask.taskId)
  if (task === null || subtask.isClosed === oldSubtask.isClosed) {
    return
  }
  const closedSubtaskIds = new Set(task.closedSubtaskIds)
  if (subtask.isClosed) {
    closedSubtaskIds.add(subtask.id)
  } else {
    closedSubtaskIds.delete(subtask.id)
  }
  TaskStore.save({
    ...task,
    closedSubtaskIds: [...closedSubtaskIds],
    isDone: closedSubtaskIds.size === task.subtaskIds.length,
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
    isDone: subtaskIds.length > 0 && subtaskIds.length === closedSubtaskIds.length,
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
