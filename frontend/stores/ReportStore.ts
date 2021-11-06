import { createModelStore } from '@/stores/Store'
import Report from '@/models/Report'

const [ReportStore, useReports, useReport] = createModelStore<Report>()({})
export default ReportStore

export {
  useReports,
  useReport,
}