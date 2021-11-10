import React from 'react'
import EreignissePage from '@/pages/ereignisse'
import ReportList from '@/components/Report/List/ReportList'
import Report from '@/models/Report'
import UiContainer from '@/components/Ui/Container/UiContainer'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import IncidentList from '@/components/Incident/List/IncidentList'

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
    <UiContainer>
      <h1>
        Meldungen
      </h1>
      <UiGrid style={{ justifyContent: 'center' }}>
        <UiGrid.Col size={{ md: 10, lg: 8, xl: 6 }}>
          <ReportList reports={reports}/>
        </UiGrid.Col>
      </UiGrid>
    </UiContainer>

  )

}

export default MeldungenPage