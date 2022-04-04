import Report, { parseReport } from '@/models/Report'
import React, { useCallback, useMemo, useState } from 'react'
import ReportStore, { useReportsOfIncident } from '@/stores/ReportStore'
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
import TransportStore, { useTransportsOfIncident } from '@/stores/TransportStore'
import UiSideList from '@/components/Ui/SideList/UiSideList'
import ReportList from '@/components/Report/List/ReportList'
import ReportView from '@/components/Report/View/ReportView'
import TransportList from '@/components/Transport/List/TransportList'
import TransportView from '@/components/Transport/View/TransportView'
import Id from '@/models/base/Id'
import Task from '@/models/Task'
import { run } from '@/utils/control-flow'

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
  const reports = useReportsOfIncident(incident.id)
  const transports = useTransportsOfIncident(incident.id)

  const [mode, _setMode] = useState<'reports' | 'transports'>(() => {
    const query = parseIncidentQuery(router.query)
    return query === null || !(query.mode === 'transports' || query.mode === 'transport')
      ? 'reports'
      : 'transports'
  })

  const reportView = useMemo(() => {
    const query = parseIncidentQuery(router.query)
    const rerouteToReport = (selected: Report) => {
      if (query === null) {
        return
      }
      if (query.mode !== 'report' || query.reportId !== selected.id) {
        router.push(`/ereignisse/${selected.incidentId}/meldungen/${selected.id}`, undefined, { shallow: true }).then()
      }
    }
    const rerouteToRoot = () => {
      if (query === null) {
        return
      }
      if (query.mode !== 'incident') {
        router.push(`/ereignisse/${incident.id}`, undefined, { shallow: true }).then()
      }
    }
    const initialId = run(() => {
      const query = parseIncidentQuery(router.query)
      return query === null || !(query.mode === 'report' || query.mode === 'task')
        ? null
        : query.reportId
    })
    return (
      <UiSideList
        store={ReportStore}
        initialId={initialId}
        onSelect={rerouteToReport}
        onDeselect={rerouteToRoot}
        renderList={({ selected, select }) => (
          <ReportList incident={incident} reports={reports} selected={selected} onSelect={select} />
        )}
        renderView={({ selected, close }) => (
          <ReportView incident={incident} report={selected} onClose={close} />
        )}
      />
    )
  }, [router, incident, reports])

  const transportView = useMemo(() => {
    const query = parseIncidentQuery(router.query)
    const rerouteToTransport = (selected: Transport) => {
      if (query === null) {
        return
      }
      if (query.mode !== 'report' || query.reportId !== selected.id) {
        router.push(`/ereignisse/${selected.incidentId}/transporte/${selected.id}`, undefined, { shallow: true }).then()
      }
    }
    const rerouteToTransports = () => {
      if (query === null) {
        return
      }
      if (query.mode !== 'transports') {
        router.push(`/ereignisse/${incident.id}/transporte`, undefined, { shallow: true }).then()
      }
    }
    const initialId = run(() => {
      const query = parseIncidentQuery(router.query)
      return query === null || query.mode !== 'transport'
        ? null
        : query.transportId
    })
    return (
      <UiSideList
        store={TransportStore}
        initialId={initialId}
        onSelect={rerouteToTransport}
        onDeselect={rerouteToTransports}
        renderList={({ selected, select }) => (
          <TransportList incident={incident} transports={transports} selected={selected} onSelect={select} />
        )}
        renderView={({ selected, close }) => (
          <TransportView incident={incident} transport={selected} onClose={close} />
        )}
      />
    )
  }, [router, incident, transports])

  return (
    <StyledIncidentView incident={incident} onDelete={handleDelete}>
      {mode === 'transports' ? transportView : reportView}
    </StyledIncidentView>
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

type Query = {
  path: string[]
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
  if (query.mode === 'report' || query.mode === 'task') {
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
  if (query.mode === 'transport') {
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
  if (query.mode === 'task') {
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

type IncidentQuery = { incidentId: Id<Incident> } & ({
  mode: 'incident'
} | {
  reportId: Id<Report>
  mode: 'report'
} | {
  reportId: Id<Report>
  taskId: Id<Task>
  mode: 'task'
} | {
  mode: 'transports'
} | {
  transportId: Id<Transport>
  mode: 'transport'
})


interface QueryPatternMatcher {
  pattern: Array<string | typeof Number>
  build: (ids: number[]) => IncidentQuery
}

const queryMatchers: QueryPatternMatcher[] = [
  {
    pattern: [Number],
    build: ([incidentId]) => ({ mode: 'incident', incidentId }),
  },
  {
    pattern: [Number, 'transporte'],
    build: ([incidentId]) => ({ mode: 'transports', incidentId }),
  },
  {
    pattern: [Number, 'transporte', Number],
    build: ([incidentId, transportId]) => ({ mode: 'transports', incidentId, transportId }),
  },
  {
    pattern: [Number, 'meldungen', Number],
    build: ([incidentId, reportId]) => ({ mode: 'report', incidentId, reportId }),
  },
  {
    pattern: [Number, 'meldungen', Number, 'auftraege', Number],
    build: ([incidentId, reportId, taskId]) => ({ mode: 'task', incidentId, reportId, taskId }),
  },
]

export const parseIncidentQuery = (query: Query | ParsedUrlQuery): IncidentQuery | null => {
  const path = query.path as string[]

  PATTERN_LOOP:
  for (const matcher of queryMatchers) {
    const ids: number[] = []
    if (path.length !== matcher.pattern.length) {
      continue
    }
    for (let i = 0; i < path.length; i++) {
      const pathSegment = path[i]
      const patternSegment = matcher.pattern[i]
      if (typeof patternSegment === 'string') {
        if (patternSegment !== pathSegment) {
          continue PATTERN_LOOP
        }
      } else {
        const id = tryParseId(pathSegment)
        if (id === null) {
          continue PATTERN_LOOP
        }
        ids.push(id)
      }
    }
    return matcher.build(ids)
  }
  return null
}

const tryParseId = (value: string | undefined): number | null => {
  if (value === undefined) {
    return null
  }
  const id = parseInt(value)
  return isNaN(id) ? null : id
}