import { createModelStore, useStored } from '@/stores/Store'
import Report, { parseReport } from '@/models/Report'
import Incident from '@/models/Incident'
import Id from '@/models/base/Id'

const [ReportStore, useReports, useReport] = createModelStore(parseReport)
export default ReportStore

export {
  useReports,
  useReport,
}

export const useReportsOfIncident = (incidentId: Id<Incident>): Report[] => {
  return useStored(ReportStore, (reports) => (
    reports.filter((report) => report.incidentId === incidentId)
  ))
}
