import { createModelStore } from '@/stores/base/Store'
import Report, { parseReport } from '@/models/Report'
import Incident from '@/models/Incident'
import Id from '@/models/base/Id'
import TaskStore from '@/stores/TaskStore'
import { createUseRecord, createUseRecords } from '@/stores/base/hooks'
import { getPriorityIndex } from '@/models/Priority'

/**
 * `ReportStore` manages all loaded {@link Report reports}.
 */
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

/**
 * `useReport` is a React hook which loads a specific report from {@link ReportStore}.
 * It re-renders whenever the report is changed.
 *
 * @param id The id of the report.
 * @return The report.
 */
export const useReport = createUseRecord(ReportStore)

/**
 * `useReports` is a React hook that loads all reports from {@link ReportStore}.
 * It re-renders whenever the store is modified.
 *
 * @param idsOrTransform? An list of ids to load, or a function that modifies the returned list.
 * @return The list of reports.
 */
export const useReports = createUseRecords(ReportStore)

/**
 * `useReportsOfIncident` is a React hook that loads all reports
 * belonging to a specific incident from {@link VehicleStore}.
 * It re-renders whenever the store is modified.
 *
 * @param incidentId The id of the incident to which the reports belong.
 * @return The list of reports belonging to the incident.
 */
export const useReportsOfIncident = (incidentId: Id<Incident>): readonly Report[] => (
  useReports((reports) => (
    reports.filter((report) => report.incidentId === incidentId)
  ), [incidentId])
)

/*
 * After a task creation the report needs to update the `tasksIds`, `closedTasksIds` and `isDone`.
 *
 * <p>
 *    A completed report has to reopen when a new uncompleted task is added.
 * </p>
 */
TaskStore.onCreate((task) => {
  const report = ReportStore.find(task.reportId)
  if (report === null) {
    return
  }

  // Save the new task in taskIds and if necessary adjust closedTaskIds and isDone.
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

/*
 * After a task update the report needs to update the `closedTasksIds` and `isDone`.
 *
 * <p>
 *    A completed report has to reopen when one of its tasks is reopened.
 *    An open report has to be set to done when its last open task is completed.
 * </p>
 */
TaskStore.onUpdate((task) => {
  const report = ReportStore.find(task.reportId)
  if (report === null) {
    return
  }

  // Add/remove the updated task to/from closedTaskIds.
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

/*
 * After a task deletion the report needs to update the `tasksIds`, `closedTasksIds` and `isDone`.
 *
 * <p>
 *    An open report has to be set to done when its last tasks is completed.
 * </p>
*/
TaskStore.onRemove((task) => {
  const report = ReportStore.find(task.reportId)
  if (report === null) {
    return
  }

  // Remove the deleted task from taskIds and closedTaskIds.
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
