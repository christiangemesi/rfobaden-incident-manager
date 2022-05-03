import React from 'react'
import UiContainer from '@/components/Ui/Container/UiContainer'
import UiTitle from '@/components/Ui/Title/UiTitle'
import TransportStore, { useTransports } from '@/stores/TransportStore'
import ReportStore, { useReports } from '@/stores/ReportStore'
import TaskStore, { useTasks } from '@/stores/TaskStore'
import SubtaskStore, { useSubtasks } from '@/stores/SubtaskStore'
import { BackendResponse, getSessionFromRequest } from '@/services/BackendService'
import Subtask, { isOpenSubtask, parseSubtask } from '@/models/Subtask'
import Task, { isOpenTask, parseTask } from '@/models/Task'
import Report, { isOpenReport, parseReport } from '@/models/Report'
import Transport, { isOpenTransport, parseTransport } from '@/models/Transport'
import { GetServerSideProps } from 'next'
import Priority from '@/models/Priority'
import IncidentStore from '@/stores/IncidentStore'
import Incident, { parseIncident } from '@/models/Incident'
import styled from 'styled-components'
import AssignmentList from '@/components/Assignment/List/AssignmentList'
import AssignmentData from '@/models/AssignmentData'
import { useEffectOnce } from 'react-use'
import User from '@/models/User'
import { useCurrentUser } from '@/stores/SessionStore'
import Trackable from '@/models/Trackable'


interface Props {
  data: {
    incidents: Incident[]
    transports: Transport[]
    reports: Report[]
    tasks: Task[]
    subtasks: Subtask[]
  }
}

const MeineAufgabenPage: React.VFC<Props> = ({ data }) => {
  useEffectOnce(() => {
    IncidentStore.saveAll(data.incidents.map(parseIncident))
    TransportStore.saveAll(data.transports.map(parseTransport))
    ReportStore.saveAll(data.reports.map(parseReport))
    TaskStore.saveAll(data.tasks.map(parseTask))
    SubtaskStore.saveAll(data.subtasks.map(parseSubtask))
  })

  const currentUser = useCurrentUser()

  const transports = useTransports(groupAssigned(currentUser, isOpenTransport))
  const reports = useReports(groupAssigned(currentUser, isOpenReport))
  const tasks = useTasks(groupAssigned(currentUser, isOpenTask))
  const subtasks = useSubtasks(groupAssigned(currentUser, isOpenSubtask))

  return (
    <UiContainer>
      <UiTitle level={1}>Meine Aufgaben</UiTitle>
      {Object.keys(transports).map((priority) => (
        <PriorityContainer key={priority}>
          <AssignmentList
            transports={transports[priority]}
            reports={reports[priority]}
            tasks={tasks[priority]}
            subtasks={subtasks[priority]}
          />
        </PriorityContainer>
      ))}
    </UiContainer>
  )
}
export default MeineAufgabenPage

type Prioritized<T> = {
  [K in Priority]: T[]
} & {
  closed: T[]
}

const groupAssigned = <T extends Trackable>(currentUser: User, isOpen: (record: T) => boolean) => (records: readonly T[]): Prioritized<T> => {
  const result: Prioritized<T> = {
    [Priority.HIGH]: [],
    [Priority.MEDIUM]: [],
    [Priority.LOW]: [],
    closed: [],
  }
  for (const record of records) {
    if (record.assigneeId !== currentUser.id) {
      continue
    }
    if (!isOpen(record)) {
      result.closed.push(record)
      continue
    }
    result[record.priority].push(record)
  }
  return result
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
  req,
}) => {
  const { user, backendService } = getSessionFromRequest(req)
  if (user === null) {
    return { redirect: { statusCode: 302, destination: '/anmelden' }}
  }

  const [incidents, incidentsError]: BackendResponse<Incident[]> = await backendService.list('incidents')
  if (incidentsError !== null) {
    throw incidentsError
  }

  const [assignments, assignmentsError]: BackendResponse<AssignmentData> = await backendService.find(
    'assignments',
  )
  if (assignmentsError !== null) {
    throw assignmentsError
  }

  return {
    props: {
      data: {
        incidents,
        transports: assignments.transports,
        reports: assignments.reports,
        tasks: assignments.tasks,
        subtasks: assignments.subtasks,
      },
    },
  }
}

const PriorityContainer = styled.div`
  margin: 1rem 0 3rem;
`
