import { createModelStore } from '@/stores/Store'
import { parseIncident } from '@/models/Incident'
import ReportStore from '@/stores/ReportStore'

const [IncidentStore, useIncidents, useIncident] = createModelStore(parseIncident)
export default IncidentStore

ReportStore.onCreate((report) => {
  const incident = IncidentStore.find(report.incidentId)
  if (incident === null) {
    return
  }
  IncidentStore.save({
    ...incident,
    reportIds: [...new Set([...incident.reportIds, report.id])],
    closedReportIds: (
      report.isClosed
        ? [...new Set([...incident.closedReportIds, report.id])]
        : incident.reportIds
    ),
  })
})
ReportStore.onUpdate((report, oldReport) => {
  const incident = IncidentStore.find(report.incidentId)
  if (incident === null || report.isClosed === oldReport.isClosed) {
    return
  }
  const closedReportIds = new Set(incident.closedReportIds)
  if (report.isClosed) {
    closedReportIds.add(report.id)
  } else {
    closedReportIds.delete(report.id)
  }
  IncidentStore.save({
    ...incident,
    closedReportIds: [...closedReportIds],
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
  if (report.isClosed) {
    closedReportIds.splice(closedReportIds.indexOf(report.id), 1)
  }
  IncidentStore.save({
    ...incident,
    reportIds,
    closedReportIds,
  })
})

export {
  useIncidents,
  useIncident,
}
