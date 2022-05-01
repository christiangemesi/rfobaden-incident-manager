import React, { useMemo } from 'react'
import UiContainer from '@/components/Ui/Container/UiContainer'
import UiTitle from '@/components/Ui/Title/UiTitle'
import TransportStore, { useTransports } from '@/stores/TransportStore'
import ReportStore, { useReports } from '@/stores/ReportStore'
import TaskStore, { useTasks } from '@/stores/TaskStore'
import SubtaskStore, { useSubtasks } from '@/stores/SubtaskStore'
import { BackendResponse, getSessionFromRequest } from '@/services/BackendService'
import Subtask, { parseSubtask } from '@/models/Subtask'
import Task, { parseTask } from '@/models/Task'
import Report, { parseReport } from '@/models/Report'
import Transport, { parseTransport } from '@/models/Transport'
import { GetServerSideProps } from 'next'
import Priority from '@/models/Priority'
import IncidentStore from '@/stores/IncidentStore'
import Incident, { parseIncident } from '@/models/Incident'
import styled from 'styled-components'
import AssignmentList from '@/components/Assignment/List/AssignmentList'
import AssignmentData from '@/models/AssignmentData'
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

  const assignedTransports = useTransports()
  const assignedReports = useReports()
  const assignedTasks = useTasks()
  const assignedSubtasks = useSubtasks()

  const [dataTrackableHigh, dataTrackableMedium, dataTrackableLow, dataTrackableClosed] = useMemo(() => {
    const openAssignments: AssignmentData[] = [
      { transports: [], reports: [], tasks: [], subtasks: []},
      { transports: [], reports: [], tasks: [], subtasks: []},
      { transports: [], reports: [], tasks: [], subtasks: []},
    ]
    const closedAssignments: AssignmentData = { transports: [], reports: [], tasks: [], subtasks: []}
    let counter = 0
    for (const priorityKey in Priority) {
      const transports: Transport[] = []
      assignedTransports.map((e) => {
        if (priorityKey == e.priority) {
          if (e.isClosed) {
            closedAssignments.transports.push(e)
          } else {
            transports.push(e)
          }
        }
      })
      openAssignments[counter].transports.push(...transports)

      const reports: Report[] = []
      assignedReports.map((e) => {
        if (priorityKey == e.priority) {
          if (e.isClosed || e.isDone) {
            closedAssignments.reports.push(e)
          } else {
            reports.push(e)
          }
        }
      })
      openAssignments[counter].reports.push(...reports)

      const tasks: Task[] = []
      assignedTasks.map((e) => {
        if (priorityKey == e.priority) {
          if (e.isClosed || e.isDone) {
            closedAssignments.tasks.push(e)
          } else {
            tasks.push(e)
          }
        }
      })
      openAssignments[counter].tasks.push(...tasks)

      const subtasks: Subtask[] = []
      assignedSubtasks.map((e) => {
        if (priorityKey == e.priority) {
          if (e.isClosed) {
            closedAssignments.subtasks.push(e)
          } else {
            subtasks.push(e)
          }
        }
      })
      openAssignments[counter].subtasks.push(...subtasks)

      counter++
    }

    return [...openAssignments, closedAssignments]
  }, [assignedTransports, assignedReports, assignedTasks, assignedSubtasks])

  return (
    <UiContainer>
      <UiTitle level={1}>Meine Aufgaben</UiTitle>
      <PriorityContainer>
        <AssignmentList
          transports={dataTrackableHigh.transports}
          reports={dataTrackableHigh.reports}
          tasks={dataTrackableHigh.tasks}
          subtasks={dataTrackableHigh.subtasks}
        />
      </PriorityContainer>
      <PriorityContainer>
        <AssignmentList
          transports={dataTrackableMedium.transports}
          reports={dataTrackableMedium.reports}
          tasks={dataTrackableMedium.tasks}
          subtasks={dataTrackableMedium.subtasks}
        />
      </PriorityContainer>
      <PriorityContainer>
        <AssignmentList
          transports={dataTrackableLow.transports}
          reports={dataTrackableLow.reports}
          tasks={dataTrackableLow.tasks}
          subtasks={dataTrackableLow.subtasks}
        />
      </PriorityContainer>
      <PriorityContainer>
        <AssignmentList
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
