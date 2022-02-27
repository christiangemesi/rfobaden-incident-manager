import { createModelStore } from '@/stores/Store'
import Report, { parseReport } from '@/models/Report'
import Incident from '@/models/Incident'
import Id from '@/models/base/Id'
import TaskStore from '@/stores/TaskStore'
import { getPriorityIndex } from '@/models/Priority'

const [ReportStore, useReports, useReport] = createModelStore(parseReport, {}, {
  sortBy: (report) => ['desc', [
    // Closed reports are always at the bottom.
    [report.isClosed || report.isDone, 'asc'],

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

  ReportStore.save({
    ...report,
    taskIds: [...new Set([...report.taskIds, task.id])],
    closedTaskIds: (
      task.isClosed || task.isDone
        ? [...new Set([...report.closedTaskIds, task.id])]
        : report.closedTaskIds
    ),
    isDone: report.isDone && task.isClosed,
  })
})
TaskStore.onUpdate((task) => {
  const report = ReportStore.find(task.reportId)
  if (report === null) {
    return
  }

  const closedTaskIds = new Set(report.closedTaskIds)
  if (task.isClosed || task.isDone) {
    closedTaskIds.add(task.id)
  } else {
    closedTaskIds.delete(task.id)
  }

  ReportStore.save({
    ...report,
    closedTaskIds: [...closedTaskIds],
    isDone: closedTaskIds.size === report.taskIds.length,
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
  if (task.isClosed || task.isDone) {
    closedTaskIds.splice(closedTaskIds.indexOf(task.id), 1)
  }

  ReportStore.save({
    ...report,
    taskIds,
    closedTaskIds,
    isDone: taskIds.length > 0 && taskIds.length === closedTaskIds.length,
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
