import { createModelStore } from '@/stores/base/Store'
import Report, { parseReport } from '@/models/Report'
import Incident from '@/models/Incident'
import Id from '@/models/base/Id'
import TaskStore from '@/stores/TaskStore'
import { createUseRecord, createUseRecords } from '@/stores/base/hooks'
import { getPriorityIndex } from '@/models/Priority'

const ReportStore = createModelStore(parseReport, {
  sortBy: (report) => [
    // Closed reports are always at the bottom.
    [report.isClosed || report.isDone, 'asc'],

    // Sort order: key > location-relevant > priority > start date
    report.isKeyReport,
    report.isLocationRelevantReport,
    getPriorityIndex(report.priority),
    [report.startsAt ?? report.createdAt, 'asc'],
    report.id,
  ],
})

export default ReportStore

export const useReport = createUseRecord(ReportStore)
export const useReports = createUseRecords(ReportStore)

export const useReportsOfIncident = (incidentId: Id<Incident>): readonly Report[] => (
  useReports((reports) => (
    reports.filter((report) => report.incidentId === incidentId)
  ), [incidentId])
)

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
    isDone: report.isDone && (task.isClosed || task.isDone),
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
