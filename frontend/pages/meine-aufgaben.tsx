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
import IncidentStore from '@/stores/IncidentStore'
import Incident, { parseIncident } from '@/models/Incident'
import styled from 'styled-components'
import AssignmentList from '@/components/Assignment/List/AssignmentList'
import AssignmentData, { groupAssigned } from '@/models/AssignmentData'
import { useEffectOnce } from 'react-use'
import { useCurrentUser } from '@/stores/SessionStore'
import Page from '@/components/Page/Page'


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
    <Page>
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
    </Page>
  )
}
export default MeineAufgabenPage

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
