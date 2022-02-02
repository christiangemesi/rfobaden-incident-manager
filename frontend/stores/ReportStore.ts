import { createModelStore } from '@/stores/Store'
import Report, { parseReport } from '@/models/Report'
import Incident from '@/models/Incident'
import Id from '@/models/base/Id'
import IncidentStore from '@/stores/IncidentStore'

const [ReportStore, useReports, useReport] = createModelStore(parseReport)
export default ReportStore

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
  const closedReportIds = [...incident.closedReportIds]
  closedReportIds.splice(closedReportIds.indexOf(report.id), 1)
  IncidentStore.save({
    ...incident,
    closedReportIds: (
      report.isClosed
        ? [...new Set([...incident.closedReportIds, report.id])]
        : closedReportIds
    ),
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
  useReports,
  useReport,
}

export const useReportsOfIncident = (incidentId: Id<Incident>): Report[] => (
  useReports((reports) => (
    reports.filter((report) => report.incidentId === incidentId)
  ), [incidentId])
)
