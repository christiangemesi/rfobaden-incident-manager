import React from 'react'
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
import { useEffectOnce } from 'react-use'

interface Props {
  data: {
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

  useEffectOnce(() => {
    TransportStore.saveAll(data.transports.map(parseTransport))
    ReportStore.saveAll(data.reports.map(parseReport))
    TaskStore.saveAll(data.tasks.map(parseTask))
    SubtaskStore.saveAll(data.subtasks.map(parseSubtask))
  })

  const usersTransports = useTransports((transports) => transports.filter(isOpenedTransport)).sort((transport)=>transport.incidentId)
  const usersReports = useReports((reports) => reports.filter(isOpenedReport)).sort((report)=>report.incidentId)
  const usersTasks = useTasks((tasks) => tasks.filter(isOpenedTask)).sort((task)=>task.incidentId)
  const usersSubtasks = useSubtasks((subtasks) => subtasks.filter(isOpenedSubtask)).sort((subtask)=>subtask.incidentId)

  return (
    <UiContainer>
      <UiTitle level={1}>Meine Aufgaben</UiTitle>
      <div id="hohe-prioritaet">

      </div>
      <div id="mittlere-prioritaet">

      </div>
      <div id="niedere-prioritaet">

      </div>
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

  const [transports, transportsError]: BackendResponse<Transport[]> = await backendService.list(
    `users/${user.id}/assignments/transports`,
  )
  if (transportsError !== null) {
    throw transportsError
  }

  const [reports, reportsError]: BackendResponse<Report[]> = await backendService.list(
    `users/${user.id}/assignments/reports`,
  )
  if (reportsError !== null) {
    throw reportsError
  }

  const [tasks, tasksError]: BackendResponse<Task[]> = await backendService.list(
    `users/${user.id}/assignments/tasks`,
  )
  if (tasksError !== null) {
    throw tasksError
  }

  const [subtasks, subtasksError]: BackendResponse<Subtask[]> = await backendService.list(
    `users/${user.id}/assignments/subtasks`,
  )
  if (subtasksError !== null) {
    throw subtasksError
  }

  return {
    props: {
      data: {
        transports,
        reports,
        tasks,
        subtasks,
      },
    },
  }
}