import { createModelStore } from '@/stores/Store'
import Task, { parseTask } from '@/models/Task'
import Report from '@/models/Report'
import Id from '@/models/base/Id'


const [TaskStore, useTasks, useTask] = createModelStore(parseTask)
export default TaskStore

export {
  useTasks,
  useTask,
}

export const useTasksOfReport = (reportId: Id<Report>): Task[] => (
  useTasks((tasks) => (
    tasks.filter((task) => task.reportId === reportId)
  ))
)