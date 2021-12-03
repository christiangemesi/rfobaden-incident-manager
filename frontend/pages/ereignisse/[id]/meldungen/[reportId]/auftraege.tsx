import React, { useState } from 'react'
import TaskForm from '@/components/Task/Form/TaskForm'
import { GetServerSideProps } from 'next'
import BackendService, { BackendResponse } from '@/services/BackendService'
import Task, { parseTask } from '@/models/Task'
import TaskList from '@/components/Task/List/TaskList'
import Incident from '@/models/Incident'
import Report from '@/models/Report'
import { useEffectOnce } from 'react-use'
import { useReport } from '@/stores/ReportStore'
import { useIncident } from '@/stores/IncidentStore'
import TaskStore, { useTasksOfReport } from '@/stores/TaskStore'
import User, { parseUser } from '@/models/User'
import UserStore from '@/stores/UserStore'
import UiContainer from '@/components/Ui/Container/UiContainer'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiModal from '@/components/Ui/Modal/UiModal'
import UiButton from '@/components/Ui/Button/UiButton'
import UiTitle from '@/components/Ui/Title/UiTitle'

interface Props {
  data: {
    incident: Incident
    report: Report
    tasks: Task[]
    users: User[]
  }
}

const AuftraegePage: React.VFC<Props> = ({ data }) => {
  useEffectOnce(() => {
    TaskStore.saveAll(data.tasks.map(parseTask))
    UserStore.saveAll(data.users.map(parseUser))
  })

  const incident = useIncident(data.incident)
  const report = useReport(data.report)
  const tasks = useTasksOfReport(report.id)

  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  return (
    <UiContainer>
      <UiTitle level={1} isCentered>
        Aufträge verwalten
      </UiTitle>
      <UiGrid style={{ justifyContent: 'center' }}>
        <UiGrid.Col size={{ md: 8, lg: 6, xl: 4 }}>
          <UiModal isFull>
            <UiModal.Activator>{({ open }) => (
              <UiButton onClick={open}>
                Auftrag erstellen
              </UiButton>
            )}</UiModal.Activator>
            <UiModal.Body>{({ close }) => (
              <UiContainer>
                <UiTitle level={1}>Auftrag erstellen</UiTitle>
                <TaskForm
                  incident={incident}
                  report={report}
                  task={selectedTask}
                  onClose={() => setSelectedTask(null)}
                />
              </UiContainer>
            )}</UiModal.Body>
          </UiModal>
        </UiGrid.Col>
      </UiGrid>
      <UiGrid style={{ justifyContent: 'center' }}>
        <UiGrid.Col size={{ md: 10, lg: 8, xl: 6 }}>
          <TaskList
            tasks={tasks}
            onEdit={setSelectedTask}
          />
        </UiGrid.Col>
      </UiGrid>
    </UiContainer>
  )
}
export default AuftraegePage


type Query = {
  id: string
  reportId: string
}

export const getServerSideProps: GetServerSideProps<Props, Query> = async ({ params }) => {
  if (params === undefined) {
    throw new Error('params is undefined')
  }

  const incidentId = parseInt(params.id)
  if(isNaN(incidentId)){
    return {
      notFound: true,
    }
  }

  const reportId = parseInt(params.reportId)
  if(isNaN(reportId)){
    return {
      notFound: true,
    }
  }

  const [incident, incidentError]: BackendResponse<Incident> = await BackendService.find(
    `incidents/${incidentId}`
  )
  if (incidentError !== null) {
    throw incidentError
  }

  const [report, reportError]: BackendResponse<Report> = await BackendService.find(
    `incidents/${incidentId}/reports/${reportId}`
  )
  if (reportError !== null) {
    throw reportError
  }

  const [tasks, tasksError]: BackendResponse<Task[]> = await BackendService.list(
    `incidents/${incidentId}/reports/${reportId}/tasks`
  )
  if (tasksError !== null) {
    throw tasksError
  }

  const [users, usersError]: BackendResponse<User[]> = await BackendService.list('users')
  if (usersError !== null) {
    throw usersError
  }

  return {
    props: {
      data: {
        incident,
        report,
        tasks,
        users,
      },
    },
  }
}