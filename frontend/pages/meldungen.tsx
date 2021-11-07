import React from 'react'
import EreignissePage from '@/pages/ereignisse'
import ReportList from '@/components/Report/List/ReportList'
import Report from '@/models/Report'

const MeldungenPage: React.VFC = () => {
  const reports: Report[] = [
    {
      title: 'Wie gehts', description: 'babbaba', assigneeId: -1, id: 0,
    },

    {
      title: 'Wie gehts', description: 'babbaba', assigneeId: -1, id: 1,
    },

    {
      title: 'Wie gehts', description: 'babbaba', assigneeId: -1, id: 2,
    },
  ]




  return (
    <div>
      <ReportList reports={reports}/>
    </div>
  )

}

export default MeldungenPage