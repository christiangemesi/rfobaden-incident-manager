import React from 'react'
import Report from '@/models/Report'
import UiList from '@/components/Ui/List/UiList'
import ReportListItem from '@/components/Report/List/ReportListItem'

interface Props {
  reports: Report[]
  activeReport: Report | null
  onClick?: (report: Report) => void
}

const ReportList: React.VFC<Props> = ({ reports, activeReport, onClick: handleClick }) => {
  return (
    <UiList>
      {reports.map((report) => (
        <ReportListItem
          key={report.id}
          report={report}
          onClick={handleClick}
          isActive={activeReport !== null && activeReport.id == report.id}
        />
      ))}
    </UiList>
  )
}
export default ReportList

