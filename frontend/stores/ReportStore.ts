import { createModelStore } from '@/stores/Store'
import Report, { parseReport } from '@/models/Report'
import Incident from '@/models/Incident'
import Id from '@/models/base/Id'
import TaskStore from '@/stores/TaskStore'
import { getPriorityIndex } from '@/models/Priority'

const [ReportStore, useReports, useReport] = createModelStore(parseReport, {}, {
  sortBy: (report) => ['desc', [
    // Closed reports are always at the bottom.
    [report.isClosed, 'asc'],

    // Sort order: key > location-relevant > priority
    report.isKeyReport,
    report.isLocationRelevantReport,
    getPriorityIndex(report.priority),
    [report.title, 'asc'],
  ]],
})
export default ReportStore

TaskStore.onCreate((task) => {
  const report = ReportStore.find(task.reportId)
  if (report === null) {
    return
  }
  const isDone = report.isClosed && task.isClosed
  ReportStore.save({
    ...report,
    taskIds: [...new Set([...report.taskIds, task.id])],
    closedTaskIds: (
      task.isClosed
        ? [...new Set([...report.closedTaskIds, task.id])]
        : report.closedTaskIds
    ),
    isDone,
    isClosed: isDone,
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
  const isDone = closedTaskIds.size === task.subtaskIds.length
  ReportStore.save({
    ...report,
    closedTaskIds: [...closedTaskIds],
    isDone,
    isClosed: report.isClosed || isDone || isDone === report.isDone,
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
  const isDone = taskIds.length > 0 && taskIds.length === closedTaskIds.length
  ReportStore.save({
    ...report,
    taskIds,
    closedTaskIds,
    isDone,
    isClosed: report.isClosed || isDone,
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
