import { createModelStore } from '@/stores/Store'
import Task, { parseTask } from '@/models/Task'
import Report from '@/models/Report'
import Id from '@/models/base/Id'
import ReportStore from '@/stores/ReportStore'


const [TaskStore, useTasks, useTask] = createModelStore(parseTask)
export default TaskStore

TaskStore.onCreate((task) => {
  const report = ReportStore.find(task.reportId)
  if (report === null) {
    return
  }
  ReportStore.save({
    ...report,
    taskIds: [...new Set([...report.taskIds, task.id])],
    closedTaskIds: (
      task.isClosed
        ? [...new Set([...report.closedTaskIds, task.id])]
        : report.taskIds
    ),
  })
})
TaskStore.onUpdate((task, oldTask) => {
  const report = ReportStore.find(task.reportId)
  if (report === null || task.isClosed === oldTask.isClosed) {
    return
  }
  const closedTaskIds = [...report.closedTaskIds]
  closedTaskIds.splice(closedTaskIds.indexOf(task.id), 1)
  ReportStore.save({
    ...report,
    closedTaskIds: (
      task.isClosed
        ? [...new Set([...report.closedTaskIds, task.id])]
        : closedTaskIds
    ),
  })
})
TaskStore.onRemove((task) => {
  const report = ReportStore.find(task.reportId)
  if (report === null) {
    return
  }
  const taskIds = [...report.taskIds]
  taskIds.splice(taskIds.indexOf(task.id), 1)
  const closedTaskIds = [...report.closedTaskIds]
  if (task.isClosed) {
    closedTaskIds.splice(closedTaskIds.indexOf(task.id), 1)
  }
  ReportStore.save({
    ...report,
    taskIds,
    closedTaskIds,
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
