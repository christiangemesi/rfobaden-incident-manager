import Report from '@/models/Report'
import React from 'react'

interface Props {
  reports: Report[]

}

const ReportList: React.VFC<Props> = ({reports}) => {
  return (
    <div>
      {reports.map((report) => (
        <div key={report.id}>
          {report.title

          }
        </div>
      ))}
    </div>
  )

}

export default ReportList