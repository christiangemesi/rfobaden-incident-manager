import Report, { parseReport } from '@/models/Report'
import React from 'react'
import ReportStore, { useReportsOfIncident } from '@/stores/ReportStore'
import UiContainer from '@/components/Ui/Container/UiContainer'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import ReportList from '@/components/Report/List/ReportList'
import ReportForm from '@/components/Report/Form/ReportForm'
import { GetServerSideProps } from 'next'
import BackendService, { BackendResponse } from '@/services/BackendService'
import Incident from '@/models/Incident'
import { useIncident } from '@/stores/IncidentStore'
import { useEffectOnce } from 'react-use'
import SessionOnly from '@/components/Session/Only/SessionOnly'
import User, { parseUser } from '@/models/User'
import UserStore from '@/stores/UserStore'

interface Props {
  data: {
    incident: Incident
    reports: Report[]
    users: User[]
  }
}

const MeldungenPage: React.VFC<Props> = ({ data }) => {
  useEffectOnce(() => {
    ReportStore.saveAll(data.reports.map(parseReport))
    UserStore.saveAll(data.users.map(parseUser))
  })

  const incident = useIncident(data.incident)
  const reports = useReportsOfIncident(incident.id)

  return (
    <SessionOnly doRedirect>
      <UiContainer>
        <h1>
          {incident.title}: Meldungen verwalten
        </h1>
        <UiGrid style={{ justifyContent: 'center' }}>
          <UiGrid.Col size={{ md:8, lg: 6, xl: 4 }}>
            <ReportForm incident={incident} />
          </UiGrid.Col>
        </UiGrid>
        <UiGrid style={{ justifyContent: 'center' }}>
          <UiGrid.Col size={{ md: 11, lg: 10, xl: 8 }}>
            <ReportList reports={reports} />
          </UiGrid.Col>
        </UiGrid>
      </UiContainer>
    </SessionOnly>
  )
}
export default MeldungenPage



type Query = {
  id: string
}

export const getServerSideProps: GetServerSideProps<Props, Query> = async ({ params }) => {
  if (params === undefined) {
    throw new Error('params is undefined')
  }

  const incidentId = parseInt(params.id)
  if(isNaN(incidentId)){
    return {
      notFound: true,
    }
  }

  const [incident, incidentError]: BackendResponse<Incident> = await BackendService.find(
    `incidents/${incidentId}`
  )
  if (incidentError !== null) {
    throw incidentError
  }

  const [reports, reportsError]: BackendResponse<Report[]> = await BackendService.list(
    `incidents/${incidentId}/reports`
  )
  if (reportsError !== null) {
    throw reportsError
  }


  const [users, usersError]: BackendResponse<User[]> = await BackendService.list('users')
  if (usersError !== null) {
    throw usersError
  }

  return {
    props: {
      data: {
        incident,
        reports,
        users,
      },
    },
  }
}