import React, { useMemo } from 'react'
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
import IncidentStore, { useIncidents } from '@/stores/IncidentStore'
import Incident, { isClosedIncident, parseIncident } from '@/models/Incident'
import styled from 'styled-components'
import Assignment from '@/components/Assignment/Assignment'
import Assignments from '@/models/Assignments'
import { useEffectOnce } from 'react-use'
import Id from '@/models/base/Id'


interface Props {
  data: {
    incidents: Incident[]
    transports: Transport[]
    reports: Report[]
    tasks: Task[]
    subtasks: Subtask[]
  }
}

type IncidentOwner = { incidentId: Id<Incident> }

const MeineAufgabenPage: React.VFC<Props> = ({ data }) => {
  useEffectOnce(() => {
    IncidentStore.saveAll(data.incidents.map(parseIncident))
    TransportStore.saveAll(data.transports.map(parseTransport))
    ReportStore.saveAll(data.reports.map(parseReport))
    TaskStore.saveAll(data.tasks.map(parseTask))
    SubtaskStore.saveAll(data.subtasks.map(parseSubtask))
  })

  const openedIncidents = useIncidents((incidents) => incidents.filter((incident) => !isClosedIncident(incident)))
  const assignedTransports = useTransports((transports) => transports.filter(isOpenTransport)).sort(sortByIncident)
  const assignedReports = useReports((reports) => reports.filter(isOpenReport)).sort(sortByIncident)
  const assignedTasks = useTasks((tasks) => tasks.filter(isOpenTask)).sort(sortByIncident)
  const assignedSubtasks = useSubtasks((subtasks) => subtasks.filter(isOpenSubtask)).sort(sortByIncident)
  const closedTransports = useTransports((transports) => transports.filter((transport) => !isOpenTransport(transport)).sort(sortByIncident))
  const closedReports = useReports((reports) => reports.filter((report) => !isOpenReport(report)).sort(sortByIncident))
  const closedTasks = useTasks((tasks) => tasks.filter((task) => !isOpenTask(task)).sort(sortByIncident))
  const closedSubtasks = useSubtasks((subtasks) => subtasks.filter((subtask) => !isOpenSubtask(subtask)).sort(sortByIncident))

  const dataTrackableHigh = useMemo(() => ({
    incidents: openedIncidents,
    transports: assignedTransports.filter((e) => e.priority == Priority.HIGH),
    reports: assignedReports.filter((e) => e.priority == Priority.HIGH),
    tasks: assignedTasks.filter((e) => e.priority == Priority.HIGH),
    subtasks: assignedSubtasks.filter((e) => e.priority == Priority.HIGH),
  }), [openedIncidents, assignedTransports, assignedReports, assignedTasks, assignedSubtasks])

  const dataTrackableMedium = useMemo(() => ({
    incidents: openedIncidents,
    transports: assignedTransports.filter((e) => e.priority == Priority.MEDIUM),
    reports: assignedReports.filter((e) => e.priority == Priority.MEDIUM),
    tasks: assignedTasks.filter((e) => e.priority == Priority.MEDIUM),
    subtasks: assignedSubtasks.filter((e) => e.priority == Priority.MEDIUM),
  }), [openedIncidents, assignedTransports, assignedReports, assignedTasks, assignedSubtasks])

  const dataTrackableLow = useMemo(() => ({
    incidents: openedIncidents,
    transports: assignedTransports.filter((e) => e.priority == Priority.LOW),
    reports: assignedReports.filter((e) => e.priority == Priority.LOW),
    tasks: assignedTasks.filter((e) => e.priority == Priority.LOW),
    subtasks: assignedSubtasks.filter((e) => e.priority == Priority.LOW),
  }), [openedIncidents, assignedTransports, assignedReports, assignedTasks, assignedSubtasks])

  const dataTrackableClosed = {
    incidents: openedIncidents,
    transports: closedTransports,
    reports: closedReports,
    tasks: closedTasks,
    subtasks: closedSubtasks,
  }

  return (
    <UiContainer>
      <UiTitle level={1}>Meine Aufgaben</UiTitle>
      <PriorityContainer>
        <Assignment
          transports={dataTrackableHigh.transports}
          reports={dataTrackableHigh.reports}
          tasks={dataTrackableHigh.tasks}
          subtasks={dataTrackableHigh.subtasks}
        />
      </PriorityContainer>
      <PriorityContainer>
        <Assignment
          transports={dataTrackableMedium.transports}
          reports={dataTrackableMedium.reports}
          tasks={dataTrackableMedium.tasks}
          subtasks={dataTrackableMedium.subtasks}
        />
      </PriorityContainer>
      <PriorityContainer>
        <Assignment
          transports={dataTrackableLow.transports}
          reports={dataTrackableLow.reports}
          tasks={dataTrackableLow.tasks}
          subtasks={dataTrackableLow.subtasks}
        />
      </PriorityContainer>
      <PriorityContainer>
        <Assignment
          transports={dataTrackableClosed.transports}
          reports={dataTrackableClosed.reports}
          tasks={dataTrackableClosed.tasks}
          subtasks={dataTrackableClosed.subtasks}
        />
      </PriorityContainer>
    </UiContainer>
  )
}
export default MeineAufgabenPage

const sortByIncident = (a: IncidentOwner, b: IncidentOwner) => a.incidentId - b.incidentId

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

  const [assignments, assignmentsError]: BackendResponse<Assignments> = await backendService.find(
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
