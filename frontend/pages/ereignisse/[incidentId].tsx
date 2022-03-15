import Report, { parseReport } from '@/models/Report'
import React, { useCallback } from 'react'
import ReportStore from '@/stores/ReportStore'
import { GetServerSideProps } from 'next'
import BackendService, { BackendResponse } from '@/services/BackendService'
import Incident from '@/models/Incident'
import { useIncident } from '@/stores/IncidentStore'
import { useEffectOnce } from 'react-use'
import User, { parseUser } from '@/models/User'
import UserStore from '@/stores/UserStore'
import OrganizationStore from '@/stores/OrganizationStore'
import Organization, { parseOrganization } from '@/models/Organization'
import IncidentView from '@/components/Incident/View/IncidentView'
import styled from 'styled-components'
import UiLevel from '@/components/Ui/Level/UiLevel'
import { useRouter } from 'next/router'

interface Props {
  data: {
    incident: Incident
    reports: Report[]
    users: User[]
    organizations: Organization[]
  }
}

const IncidentPage: React.VFC<Props> = ({ data }) => {
  useEffectOnce(() => {
    ReportStore.saveAll(data.reports.map(parseReport))
    UserStore.saveAll(data.users.map(parseUser))
    OrganizationStore.saveAll(data.organizations.map(parseOrganization))
  })

  const router = useRouter()
  const handleDelete = useCallback(async () => {
    await router.push('/ereignisse')
  }, [router])

  const incident = useIncident(data.incident)
  return (
    <StyledIncidentView incident={incident} onDelete={handleDelete} />
  )
}
export default IncidentPage

const StyledIncidentView = styled(IncidentView)`
  padding-top: 0;
  min-height: calc(100vh - 4rem - 4rem - 2rem);
  flex: 1;
  
  & > ${UiLevel.Header} {
    padding-top: 0;
  }
  & > ${UiLevel.Content} {
    padding-bottom: 4px;
  }
`

export type Query = {
  incidentId: string,
  reportId: string | undefined
}

export const getServerSideProps: GetServerSideProps<Props, Query> = async ({ params }) => {
  if (params === undefined) {
    throw new Error('params is undefined')
  }

  const incidentId = parseInt(params.incidentId)
  if (isNaN(incidentId)) {
    return {
      notFound: true,
    }
  }

  const [incident, incidentError]: BackendResponse<Incident> = await BackendService.find(
    `incidents/${incidentId}`,
  )
  if (incidentError !== null) {
    throw incidentError
  }

  const [reports, reportsError]: BackendResponse<Report[]> = await BackendService.list(
    `incidents/${incidentId}/reports`,
  )
  if (reportsError !== null) {
    throw reportsError
  }

  const [organizations, organizationError]: BackendResponse<Organization[]> = await BackendService.list(
    'organizations',
  )
  if (organizationError !== null) {
    throw organizationError
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
        organizations,
      },
    },
  }
}
