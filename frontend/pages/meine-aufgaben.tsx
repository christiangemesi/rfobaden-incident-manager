import React, { useEffect, useMemo } from 'react'
import UiContainer from '@/components/Ui/Container/UiContainer'
import UiTitle from '@/components/Ui/Title/UiTitle'
import { useSession } from '@/stores/SessionStore'
import TransportStore, { useTransports } from '@/stores/TransportStore'
import ReportStore, { useReports } from '@/stores/ReportStore'
import TaskStore, { useTasks } from '@/stores/TaskStore'
import SubtaskStore, { useSubtasks } from '@/stores/SubtaskStore'
import { BackendResponse, getSessionFromRequest } from '@/services/BackendService'
import Subtask, { isOpenedSubtask, parseSubtask } from '@/models/Subtask'
import Task, { isOpenedTask, parseTask } from '@/models/Task'
import Report, { isOpenedReport, parseReport } from '@/models/Report'
import Transport, { isOpenedTransport, parseTransport } from '@/models/Transport'
import { GetServerSideProps } from 'next'
import Priority from '@/models/Priority'
import IncidentStore, { useIncidents } from '@/stores/IncidentStore'
import Incident, { isClosedIncident, parseIncident } from '@/models/Incident'
import styled from 'styled-components'
import AssignedList from '@/components/AssignedList/AssignedList'
import Assignments from '@/models/Assignments'


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
  const { currentUser } = useSession()
  if (currentUser === null) {
    throw new Error('not signed in')
  }

  useEffect(() => {
    IncidentStore.saveAll(data.incidents.map(parseIncident))
    TransportStore.saveAll(data.transports.map(parseTransport))
    ReportStore.saveAll(data.reports.map(parseReport))
    TaskStore.saveAll(data.tasks.map(parseTask))
    SubtaskStore.saveAll(data.subtasks.map(parseSubtask))
  }, [data, currentUser])

  const openedIncidents = useIncidents((incidents) => incidents.filter((incident) => !isClosedIncident(incident)))
  const usersTransports = useTransports((transports) => transports.filter(isOpenedTransport)).sort((a, b) => a.incidentId - b.incidentId)
  const usersReports = useReports((reports) => reports.filter(isOpenedReport)).sort((a, b) => a.incidentId - b.incidentId)
  const usersTasks = useTasks((tasks) => tasks.filter(isOpenedTask)).sort((a, b) => a.incidentId - b.incidentId)
  const usersSubtasks = useSubtasks((subtasks) => subtasks.filter(isOpenedSubtask)).sort((a, b) => a.incidentId - b.incidentId)
  const usersDoneTransports = useTransports((transports) => transports.filter((transport) => !isOpenedTransport(transport)).sort((a, b) => a.incidentId - b.incidentId))
  const usersDoneReports = useReports((reports) => reports.filter((report) => !isOpenedReport(report)).sort((a, b) => a.incidentId - b.incidentId))
  const usersDoneTasks = useTasks((tasks) => tasks.filter((task) => !isOpenedTask(task)).sort((a, b) => a.incidentId - b.incidentId))
  const usersDoneSubtasks = useSubtasks((subtasks) => subtasks.filter((subtask) => !isOpenedSubtask(subtask)).sort((a, b) => a.incidentId - b.incidentId))

  const dataTrackableHigh = useMemo(() => ({
    incidents: openedIncidents,
    transports: usersTransports.filter((e) => e.priority == Priority.HIGH),
    reports: usersReports.filter((e) => e.priority == Priority.HIGH),
    tasks: usersTasks.filter((e) => e.priority == Priority.HIGH),
    subtasks: usersSubtasks.filter((e) => e.priority == Priority.HIGH),
  }), [openedIncidents, usersTransports, usersReports, usersTasks, usersSubtasks])

  const dataTrackableMedium = useMemo(() => ({
    incidents: openedIncidents,
    transports: usersTransports.filter((e) => e.priority == Priority.MEDIUM),
    reports: usersReports.filter((e) => e.priority == Priority.MEDIUM),
    tasks: usersTasks.filter((e) => e.priority == Priority.MEDIUM),
    subtasks: usersSubtasks.filter((e) => e.priority == Priority.MEDIUM),
  }), [openedIncidents, usersTransports, usersReports, usersTasks, usersSubtasks])

  const dataTrackableLow = useMemo(() => ({
    incidents: openedIncidents,
    transports: usersTransports.filter((e) => e.priority == Priority.LOW),
    reports: usersReports.filter((e) => e.priority == Priority.LOW),
    tasks: usersTasks.filter((e) => e.priority == Priority.LOW),
    subtasks: usersSubtasks.filter((e) => e.priority == Priority.LOW),
  }), [openedIncidents, usersTransports, usersReports, usersTasks, usersSubtasks])

  const dataTrackableDone = {
    incidents: openedIncidents,
    transports: usersDoneTransports,
    reports: usersDoneReports,
    tasks: usersDoneTasks,
    subtasks: usersDoneSubtasks,
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
