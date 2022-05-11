import { createModelStore } from '@/stores/base/Store'
import Task, { parseTask } from '@/models/Task'
import Report from '@/models/Report'
import Id from '@/models/base/Id'
import SubtaskStore from '@/stores/SubtaskStore'
import { createUseRecord, createUseRecords } from '@/stores/base/hooks'
import { getPriorityIndex } from '@/models/Priority'
import useWhere from '@/utils/hooks/useWhere'

const TaskStore = createModelStore(parseTask, {
  sortBy: (task) => [
    [task.isClosed || task.isDone, 'asc'],
    getPriorityIndex(task.priority),
    [task.title.toLowerCase(), 'asc'],
  ],
})

export default TaskStore

export const useTask = createUseRecord(TaskStore)
export const useTasks = createUseRecords(TaskStore)

export const useTasksOfReport = (reportId: Id<Report>): Task[] => (
  useWhere(useTasks(), (it) => it.reportId, reportId)
)

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
    isClosed: subtask.isClosed && task.isClosed,
  })
})
SubtaskStore.onUpdate((subtask) => {
  const task = TaskStore.find(subtask.taskId)
  if (task === null) {
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
