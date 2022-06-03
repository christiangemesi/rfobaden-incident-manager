import { createModelStore } from '@/stores/base/Store'
import Task from '@/models/Task'
import Id from '@/models/base/Id'
import Subtask, { parseSubtask } from '@/models/Subtask'
import { createUseRecord, createUseRecords } from '@/stores/base/hooks'
import { getPriorityIndex } from '@/models/Priority'

/**
 * `SubtaskStore` manages all loaded {@link Subtask subtasks}.
 */
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

/**
 * `useSubtask` is a React hook which loads a specific subtask from {@link SubtaskStore}.
 * It re-renders whenever the user is changed.
 *
 * @param id The id of the subtask.
 * @return The subtask.
 */
export const useSubtask = createUseRecord(SubtaskStore)

/**
 * `useSubtasks` is a React hook that loads all subtasks from {@link SubtaskStore}.
 * It re-renders whenever the store is modified.
 *
 * @param idsOrTransform? An list of ids to load, or a function that modifies the returned list.
 * @return The list of subtasks.
 */
export const useSubtasks = createUseRecords(SubtaskStore)

/**
 * `useSubtasksOfTask` is a React hook that loads all subtasks
 * belonging to a specific task from {@link TaskStore}.
 * It re-renders whenever the store is modified.
 *
 * @param taskId The id of the tasks to which the subtasks belong.
 * @return The list of subtasks belonging to the task.
 */
export const useSubtasksOfTask = (taskId: Id<Task>): Subtask[] => (
  useSubtasks((subtasks) => (
    subtasks.filter((subtask) => subtask.taskId === taskId)
  ), [taskId])
)
