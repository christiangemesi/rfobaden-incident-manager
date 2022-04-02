import Report, { parseReport } from '@/models/Report'
import React, { useCallback } from 'react'
import ReportStore from '@/stores/ReportStore'
import { GetServerSideProps } from 'next'
import { BackendResponse, getSessionFromRequest } from '@/services/BackendService'
import Incident from '@/models/Incident'
import { useIncident } from '@/stores/IncidentStore'
import User, { parseUser } from '@/models/User'
import UserStore from '@/stores/UserStore'
import OrganizationStore from '@/stores/OrganizationStore'
import Organization, { parseOrganization } from '@/models/Organization'
import IncidentView from '@/components/Incident/View/IncidentView'
import styled from 'styled-components'
import UiLevel from '@/components/Ui/Level/UiLevel'
import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'
import { useEffectOnce } from 'react-use'
import Transport, { parseTransport } from '@/models/Transport'
import TransportStore from '@/stores/TransportStore'

interface Props {
  data: {
    incident: Incident
    reports: Report[]
    transports: Transport[]
    users: User[]
    organizations: Organization[]
  }
}

const IncidentPage: React.VFC<Props> = ({ data }) => {
  useEffectOnce(() => {
    ReportStore.saveAll(data.reports.map(parseReport))
    TransportStore.saveAll(data.transports.map(parseTransport))
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

export type IncidentQuery = {
  incidentId: number
  reportId: null
  transportId: null
  taskId: null
} | {
  incidentId: number
  reportId: number
  transportId: null
  taskId: null
} | {
  incidentId: number
  reportId: number
  transportId: null
  taskId: number
} | {
  incidentId: number
  reportId: null
  transportId: number
  taskId: null
}

type Query = {
  path: string[]
}

export const parseIncidentQuery = (query: Query | ParsedUrlQuery): IncidentQuery | null => {
  const { path: [incidentId, reportsName, reportId, transportName, transportId, taskName, taskId] } = query as Query
  if (
    (query as Query).path.length > 7
    || incidentId === undefined
    || (reportsName !== undefined && reportsName !== 'meldungen')
    || (transportName !== undefined && transportName !== 'transporte')
    || (taskName !== undefined && taskName !== 'auftraege')
  ) {
    return null
  }

  const tryParseId = (value: string | undefined): number | null => {
    if (value === undefined) {
      return null
    }
    const id = parseInt(value)
    return isNaN(id) ? null : id
  }

  const parsedIncidentId = tryParseId(incidentId)
  if (parsedIncidentId === null) {
    return null
  }

  return {
    incidentId: parsedIncidentId,
    reportId: tryParseId(reportId),
    transportId: tryParseId(transportId),
    taskId: tryParseId(taskId),
  } as IncidentQuery
}

export const getServerSideProps: GetServerSideProps<Props, Query> = async ({ req, params }) => {
  const { user, backendService } = getSessionFromRequest(req)
  if (user === null) {
    return { redirect: { statusCode: 302, destination: '/anmelden' }}
  }

  if (params === undefined) {
    throw new Error('params is undefined')
  }

  const query = parseIncidentQuery(params)
  if (query === null) {
    return { notFound: true }
  }

  const [incident, incidentError]: BackendResponse<Incident> = await backendService.find(
    `incidents/${query.incidentId}`,
  )
  if (incidentError !== null) {
    if (incidentError.status === 404) {
      return { notFound: true }
    }
    throw incidentError
  }

  // Check if the report exists.
  if (query.reportId !== null) {
    const [_, reportError]: BackendResponse<Report> = await backendService.find(
      `incidents/${incident.id}/reports/${query.reportId}`,
    )
    if (reportError !== null) {
      if (reportError.status === 404) {
        return { notFound: true }
      }
      throw reportError
    }
  }

  // Check if the transport exists.
  if (query.transportId !== null) {
    const [_, transportsError]: BackendResponse<Transport> = await backendService.find(
      `incidents/${incident.id}/transports/${query.transportId}`,
    )
    if (transportsError !== null) {
      if (transportsError.status === 404) {
        return { notFound: true }
      }
      throw transportsError
    }
  }

  // Check if the task exists.
  if (query.taskId !== null) {
    const [_, taskError]: BackendResponse<Report> = await backendService.find(
      `incidents/${incident.id}/reports/${query.reportId}/tasks/${query.taskId}`,
    )
    if (taskError !== null) {
      if (taskError.status === 404) {
        return { notFound: true }
      }
      throw taskError
    }
  }

  const [reports, reportsError]: BackendResponse<Report[]> = await backendService.list(
    `incidents/${query.incidentId}/reports`,
  )
  if (reportsError !== null) {
    throw reportsError
  }

  const [transports, transportsError]: BackendResponse<Transport[]> = await backendService.list(
    `incidents/${query.incidentId}/transports`,
  )
  if (transportsError !== null) {
    throw transportsError
  }

  const [users, usersError]: BackendResponse<User[]> = await backendService.list('users')
  if (usersError !== null) {
    throw usersError
  }

  const [organizations, organizationError]: BackendResponse<Organization[]> = await backendService.list(
    'organizations',
  )
  if (organizationError !== null) {
    throw organizationError
  }

  return {
    props: {
      data: {
        incident,
        reports,
        transports,
        users,
        organizations,
      },
    },
  }
}
