import { createModelStore } from '@/stores/Store'
import Report, { parseReport } from '@/models/Report'
import Incident from '@/models/Incident'
import Id from '@/models/base/Id'
import TaskStore from '@/stores/TaskStore'

const [ReportStore, useReports, useReport] = createModelStore(parseReport)
export default ReportStore

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
    isClosed: report.isClosed && task.isClosed,
  })
})
TaskStore.onUpdate((task, oldTask) => {
  const report = ReportStore.find(task.reportId)
  if (report === null || task.isClosed === oldTask.isClosed) {
    return
  }
  const closedTaskIds = new Set(report.closedTaskIds)
  if (task.isClosed) {
    closedTaskIds.add(task.id)
  } else {
    closedTaskIds.delete(task.id)
  }
  ReportStore.save({
    ...report,
    closedTaskIds: [...closedTaskIds],
    isClosed: closedTaskIds.size === task.subtaskIds.length,
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
    isClosed: taskIds.length > 0 && taskIds.length === closedTaskIds.length,
  })
})

export {
  useReports,
  useReport,
}

export const useReportsOfIncident = (incidentId: Id<Incident>): Report[] => (
  useReports((reports) => (
    reports.filter((report) => report.incidentId === incidentId)
  ), [incidentId])
)
