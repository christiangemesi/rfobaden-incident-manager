import Report, { parseReport } from '@/models/Report'
import React from 'react'
import { useEffectOnce } from 'react-use'
import ReportStore, { useReports } from '@/stores/ReportStore'
import UiContainer from '@/components/Ui/Container/UiContainer'
import UiGrid from '@/components/Ui/Grid/UiGrid'

import ReportList from '@/components/Report/List/ReportList'
import ReportForm from '@/components/Report/Form/ReportForm'
import { GetServerSideProps } from 'next'
import BackendService, { BackendResponse } from '@/services/BackendService'


interface Props {
  data: {
    reports: Report[]
  }
}

const ReportsPage: React.VFC<Props> = ({ data }) => {
  useEffectOnce(() => {
    ReportStore.saveAll(data.reports.map(parseReport))
  })

  const reports = useReports()

  return (
    <UiContainer>
      <h1>
        Reports verwalten
      </h1>
      <UiGrid style={{ justifyContent: 'center' }}>
        <UiGrid.Col size={{ md:8, lg: 6, xl: 4 }}>
          <ReportForm/>
        </UiGrid.Col>
      </UiGrid>
      <UiGrid style={{ justifyContent: 'center' }}>
        <UiGrid.Col size={{ md: 10, lg: 8, xl: 6 }}>
          <ReportList reports={reports}/>
        </UiGrid.Col>
      </UiGrid>
    </UiContainer>
  )
}
export default ReportsPage

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const [reports]: BackendResponse<Report[]> = await BackendService.list('reports')
  return {
    props: {
      data: {
        reports,
      },
    },
  }
}