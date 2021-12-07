import React, { useState } from 'react'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import styled from 'styled-components'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UiTextWithIcon from '@/components/Ui/TextWithIcon/UiTextWithIcon'
import User, { parseUser } from '@/models/User'
import UiContainer from '@/components/Ui/Container/UiContainer'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiActionButton from '@/components/Ui/Button/UiActionButton'
import { useEffectOnce } from 'react-use'
import UserStore, { useUser } from '@/stores/UserStore'
import { useTask, useTasksOfReport } from '@/stores/TaskStore'
import { useReport } from '@/stores/ReportStore'
import Report from '@/models/Report'
import Incident from '@/models/Incident'
import { GetServerSideProps } from 'next'
import BackendService, { BackendResponse } from '@/services/BackendService'
import SubtaskList from '@/components/Subtask/List/SubtaskList'
import Task from '@/models/Task'
import { useIncident } from '@/stores/IncidentStore'

interface Props{
  data: {
    incident: Incident
    report: Report
    task: Task
    users: User[]
  }
}

const TaskPage: React.VFC<Props> = ({ data }) => {
  useEffectOnce(() => {
    UserStore.saveAll(data.users.map(parseUser))
  })

  const _incident = useIncident(data.incident)
  const report = useReport(data.report)
  const task = useTask(data.task)

  const assignee = useUser(task.assigneeId)

  // TODO Use custom hook for username.
  const assigneeName = assignee?.firstName + ' ' + assignee?.lastName ?? ''

  // TODO replace with subtasks.
  const subtasks = useTasksOfReport(report.id)

  // TODO Store only id and load subtask from store.
  const [selectedSubtask, setSelectedSubtask] = useState<Task | null>(null)

  // TODO Rewrite grid.
  return (
    <UiContainer>
      <UiGrid gapH={2} gapV={1}>
        <UiGrid.Col size={12}>
          <UiTitle level={2}>
            {report.title} {<UiIcon.PriorityHigh />}
          </UiTitle>
        </UiGrid.Col>

        <UiGrid.Col size={12}>
          {report.description}
        </UiGrid.Col>

        <UiGrid.Col size={12}>

          {report.location !== null && (
            <UiTextWithIcon text={report.location}>
              <UiIcon.Location />
            </UiTextWithIcon>
          )}
        </UiGrid.Col>
        <UiGrid.Col size={12}>
          <UiTextWithIcon text={assigneeName}>
            <UiIcon.UserInCircle />
          </UiTextWithIcon>
        </UiGrid.Col>

        {report.notes !== null && (
          <UiGrid.Col size={12}>
            <UiTextWithIcon text={report.notes}>
              <UiIcon.AlertCircle />
            </UiTextWithIcon>
          </UiGrid.Col>
        )}

        <UiGrid.Col size={6}>
          <StyledDiv>
            <div>{/*TODO fill in modal form instead of div*/}</div>
            <UiActionButton>
              <UiIcon.CreateAction />
            </UiActionButton>
          </StyledDiv>
        </UiGrid.Col>
        <UiGrid.Col size={6} />

        <UiGrid.Col size={6}>
          <SubtaskList subtasks={subtasks} activeSubtask={selectedSubtask} onClick={setSelectedSubtask} />
        </UiGrid.Col>
      </UiGrid>

    </UiContainer>
  )
}
export default TaskPage

type Query = {
  incidentId: string
  reportId: string
  taskId: string
}

export const getServerSideProps: GetServerSideProps<Props, Query> = async ({ params }) => {
  if (params === undefined) {
    throw new Error('params is undefined')
  }

  const incidentId = parseInt(params.incidentId)
  if (isNaN(incidentId)) {
    return {
      notFound: true,
    }
  }

  const [incident, incidentError]: BackendResponse<Incident> = await BackendService.find(
    `incidents/${incidentId}`,
  )
  if (incidentError !== null) {
    throw incidentError
  }

  const reportId = parseInt(params.reportId)
  if (isNaN(reportId)) {
    return {
      notFound: true,
    }
  }

  const [report, reportError]: BackendResponse<Report> = await BackendService.find(
    `incidents/${incidentId}/reports/${reportId}`,
  )
  if (reportError !== null) {
    throw reportError
  }

  const taskId = parseInt(params.taskId)
  if (isNaN(taskId)) {
    return {
      notFound: true,
    }
  }

  const [task, taskError]: BackendResponse<Task> = await BackendService.find(
    `incidents/${incidentId}/reports/${reportId}/tasks/${taskId}`,
  )
  if (taskError !== null) {
    throw taskError
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
        task,
        subtasks: [],
        users,
      },
    },
  }
}

const StyledDiv = styled.div`
  display: flex;
  justify-content: space-between;
`
