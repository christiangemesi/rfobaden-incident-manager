import { parseIncident } from '@/models/Incident'
import ReportStore from '@/stores/ReportStore'
import { createModelStore } from './base/Store'
import { createUseRecord, createUseRecords } from '@/stores/base/hooks'

const IncidentStore = createModelStore(parseIncident)

export default IncidentStore

export const useIncident = createUseRecord(IncidentStore)
export const useIncidents = createUseRecords(IncidentStore)

ReportStore.onCreate((report) => {
  const incident = IncidentStore.find(report.incidentId)
  if (incident === null) {
    return
  }

  IncidentStore.save({
    ...incident,
    reportIds: [...new Set([...incident.reportIds, report.id])],
    closedReportIds: (
      report.isClosed || report.isDone
        ? [...new Set([...incident.closedReportIds, report.id])]
        : incident.closedReportIds
    ),
    isDone: incident.isDone && report.isClosed,
  })
})
ReportStore.onUpdate((report) => {
  const incident = IncidentStore.find(report.incidentId)
  if (incident === null) {
    return
  }

  const closedReportIds = new Set(incident.closedReportIds)
  if (report.isClosed || report.isDone) {
    closedReportIds.add(report.id)
  } else {
    closedReportIds.delete(report.id)
  }

  IncidentStore.save({
    ...incident,
    closedReportIds: [...closedReportIds],
    isDone: closedReportIds.size === incident.reportIds.length,
  })
})
ReportStore.onRemove((report) => {
  const incident = IncidentStore.find(report.incidentId)
  if (incident === null) {
    return
  }

  const reportIds = [...incident.reportIds]
  reportIds.splice(reportIds.indexOf(report.id), 1)

  const closedReportIds = [...incident.closedReportIds]
  if (report.isClosed || report.isDone) {
    closedReportIds.splice(closedReportIds.indexOf(report.id), 1)
  }

  IncidentStore.save({
    ...incident,
    reportIds,
    closedReportIds,
    isDone: reportIds.length > 0 && reportIds.length === closedReportIds.length,
  })
})
