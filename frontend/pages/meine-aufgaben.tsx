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
import AssignedList from '@/components/AssignedList/AssignedList'
import Assignments from '@/models/Assignments'
import { useEffectOnce } from 'react-use'


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

  const openedIncidents = useIncidents((incidents) => incidents.filter((incident) => !isClosedIncident(incident)))
  const assignedTransports = useTransports((transports) => transports.filter(isOpenTransport)).sort((a, b) => a.incidentId - b.incidentId)
  const assignedReports = useReports((reports) => reports.filter(isOpenReport)).sort((a, b) => a.incidentId - b.incidentId)
  const assignedTasks = useTasks((tasks) => tasks.filter(isOpenTask)).sort((a, b) => a.incidentId - b.incidentId)
  const assignedSubtasks = useSubtasks((subtasks) => subtasks.filter(isOpenSubtask)).sort((a, b) => a.incidentId - b.incidentId)
  const closedTransports = useTransports((transports) => transports.filter((transport) => !isOpenTransport(transport)).sort((a, b) => a.incidentId - b.incidentId))
  const closedReports = useReports((reports) => reports.filter((report) => !isOpenReport(report)).sort((a, b) => a.incidentId - b.incidentId))
  const closedTasks = useTasks((tasks) => tasks.filter((task) => !isOpenTask(task)).sort((a, b) => a.incidentId - b.incidentId))
  const closedSubtasks = useSubtasks((subtasks) => subtasks.filter((subtask) => !isOpenSubtask(subtask)).sort((a, b) => a.incidentId - b.incidentId))

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

  const dataTrackableDone = {
    incidents: openedIncidents,
    transports: closedTransports,
    reports: closedReports,
    tasks: closedTasks,
    subtasks: closedSubtasks,
  }

  return (
    <UiContainer>
      <UiTitle level={1}>Meine Aufgaben</UiTitle>
      <PriorityContainer id="hohe-prio">
        <AssignedList data={dataTrackableHigh} />
      </PriorityContainer>
      <PriorityContainer id="mittlere-prio">
        <AssignedList data={dataTrackableMedium} />
      </PriorityContainer>
      <PriorityContainer id="tiefe-prio">
        <AssignedList data={dataTrackableLow} />
      </PriorityContainer>
      <PriorityContainer id="done">
        <AssignedList data={dataTrackableDone} />
      </PriorityContainer>
    </UiContainer>
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
