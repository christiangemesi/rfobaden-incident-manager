import { createModelStore } from '@/stores/base/Store'
import Task, { parseTask } from '@/models/Task'
import Report from '@/models/Report'
import Id from '@/models/base/Id'
import SubtaskStore from '@/stores/SubtaskStore'
import { createUseRecord, createUseRecords } from '@/stores/base/hooks'
import { getPriorityIndex } from '@/models/Priority'

/**
 * `TaskStore` manages all loaded {@link Task tasks}.
 */
const TaskStore = createModelStore(parseTask, {
  sortBy: (task) => [
    // Closed tasks are always at the bottom.
    [task.isClosed || task.isDone, 'asc'],

    // Sort order: priority > start date
    getPriorityIndex(task.priority),
    [task.startsAt ?? task.createdAt, 'asc'],
    task.id,
  ],
})
export default TaskStore

/**
 * `useTask` is a React hook which loads a specific task from {@link TaskStore}.
 * It re-renders whenever the tasks is changed.
 *
 * @param id The id of the tasks.
 * @return The tasks.
 */
export const useTask = createUseRecord(TaskStore)

/**
 * `useTasks` is a React hook that loads all tasks from {@link TaskStore}.
 * It re-renders whenever the store is modified.
 *
 * @param idsOrTransform? An list of ids to load, or a function that modifies the returned list.
 * @return The list of tasks.
 */
export const useTasks = createUseRecords(TaskStore)

/**
 * `useTasksOfReport` is a React hook that loads all tasks
 * belonging to a specific report from {@link TaskStore}.
 * It re-renders whenever the store is modified.
 *
 * @param reportId The id of the report to which the tasks belong.
 * @return The list of tasks belonging to the report.
 */
export const useTasksOfReport = (reportId: Id<Report>): Task[] => (
  useTasks((tasks) => (
    tasks.filter((task) => task.reportId === reportId)
  ), [reportId])
)

/*
 * After a subtask creation the task needs to update the `subtaskIds`, `closedSubtaskIds` and `isDone`.
 *
 * <p>
 *    A completed task has to reopen when a new uncompleted subtask is added.
 * </p>
 */
SubtaskStore.onCreate((subtask) => {
  const task = TaskStore.find(subtask.taskId)
  if (task === null) {
    return
  }

  // Save the new subtask in subtaskIds and if necessary adjust closedSubtaskIds and isDone.
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

/*
 * After a subtask update the task needs to update the `closedSubtaskIds` and `isDone`.
 *
 * <p>
 *    A completed task has to reopen when one of its subtask is reopened.
 *    An open task has to be set to done when its last open subtask is completed.
 * </p>
 */
SubtaskStore.onUpdate((subtask) => {
  const task = TaskStore.find(subtask.taskId)
  if (task === null) {
    return
  }

  // Add/remove the updated subtask to/from closedSubtaskIds.
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

/*
 * After a subtask deletion the task needs to update the `subtaskIds`, `closedSubtaskIds` and `isDone`.
 *
 * <p>
 *    An open task has to be set to done when its last subtask is completed.
 * </p>
*/
SubtaskStore.onRemove((subtask) => {
  const task = TaskStore.find(subtask.taskId)
  if (task === null) {
    return
  }

  // Remove the deleted subtask from subtaskIds and closedSubtaskIds.
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
