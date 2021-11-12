import React from 'react'
import ReportList from '@/components/Report/List/ReportList'
import Report from '@/models/Report'
import UiContainer from '@/components/Ui/Container/UiContainer'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import ReportStore, { useReports } from '@/stores/ReportStore'

const MeldungenPage: React.VFC = () => {
  const reports = useReports()


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