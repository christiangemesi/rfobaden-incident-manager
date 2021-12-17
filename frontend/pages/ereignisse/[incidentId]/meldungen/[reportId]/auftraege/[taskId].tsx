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
import { useTask } from '@/stores/TaskStore'
import { useReport } from '@/stores/ReportStore'
import Report from '@/models/Report'
import Incident from '@/models/Incident'
import { GetServerSideProps } from 'next'
import BackendService, { BackendResponse } from '@/services/BackendService'
import SubtaskList from '@/components/Subtask/List/SubtaskList'
import Task from '@/models/Task'
import { useIncident } from '@/stores/IncidentStore'
import Subtask, { parseSubtask } from '@/models/Subtask'
import SubtaskStore, { useSubtask, useSubtaskOfTask } from '@/stores/SubtaskStore'
import UiDateLabel from '@/components/Ui/DateLabel/UiDateLabel'
import UiIconButtonGroup from '@/components/Ui/Icon/Button/Group/UiIconButtonGroup'
import UiIconButton from '@/components/Ui/Icon/Button/UiIconButton'
import UiModal from '@/components/Ui/Modal/UiModal'
import TaskForm from '@/components/Task/Form/TaskForm'
import SubtaskForm from '@/components/Subtask/Form/SubtaskForm'
import SubtaskView from '@/components/Subtask/View/SubtaskView'
import Id from '@/models/base/Id'

interface Props {
  data: {
    incident: Incident
    report: Report
    task: Task
    subtasks: Subtask[]
    users: User[]
  }
}

const TaskPage: React.VFC<Props> = ({ data }) => {
  useEffectOnce(() => {
    UserStore.saveAll(data.users.map(parseUser))
    SubtaskStore.saveAll(data.subtasks.map(parseSubtask))
  })

  const incident = useIncident(data.incident)
  const report = useReport(data.report)
  const task = useTask(data.task)
  const assignee = useUser(task.assigneeId)

  // TODO Use custom hook for username.
  const assigneeName = assignee?.firstName + ' ' + assignee?.lastName ?? ''

  const subtasks = useSubtaskOfTask(task.id)

  const [selectedSubtaskId, setSelectedSubtaskId] = useState<Id<Subtask> | null>(null)
  const selectedSubtask = useSubtask(selectedSubtaskId)

  const startDate = task.startsAt !== null ? task.startsAt : task.createdAt

  return (
    <UiContainer>

      {/* Title */}
      <VerticalSpacer>
        <UiTitle level={2}>
          {task.title}
        </UiTitle>
      </VerticalSpacer>

      {/* Create Form */}
      <UiModal isFull>
        <UiModal.Activator>{({ open }) => (
          <UiActionButton onClick={open}>
            <UiIcon.CreateAction />
          </UiActionButton>
        )}</UiModal.Activator>
        <UiModal.Body>{({ close }) => (
          <div>
            <UiTitle level={1} isCentered>
              Teilauftrag erfassen
            </UiTitle>
            <SubtaskForm incident={incident} report={report} task={task} onClose={close} />
          </div>
        )}</UiModal.Body>
      </UiModal>

      <VerticalSpacer>
        <HorizontalSpacer>
          <UiDateLabel start={startDate} end={task.endsAt} />

          {/* Button Group */}
          <UiIconButtonGroup>
            <UiIconButton onClick={() => alert('not yet implemented')}>
              <UiIcon.PrintAction />
            </UiIconButton>

            {/* Edit Form */}
            <UiModal isFull>
              <UiModal.Activator>{({ open }) => (
                <UiIconButton onClick={open}>
                  <UiIcon.EditAction />
                </UiIconButton>
              )}</UiModal.Activator>
              <UiModal.Body>{({ close }) => (
                <React.Fragment>
                  <UiTitle level={1} isCentered>
                    Task bearbeiten
                  </UiTitle>
                  <TaskForm incident={incident} report={report} task={task} onClose={close} />
                </React.Fragment>
              )}</UiModal.Body>
            </UiModal>


            {/*<UiIconButton onClick={handleDelete}>*/}
            {/*  <UiIcon.DeleteAction />*/}
            {/*</UiIconButton>*/}

          </UiIconButtonGroup>
        </HorizontalSpacer>
      </VerticalSpacer>
      <BlockContainer>
        {task.description}
      </BlockContainer>
      {task.location && (
        <BlockContainer>
          <UiTextWithIcon text={task.location ?? ''}>
            <UiIcon.Location />
          </UiTextWithIcon>
        </BlockContainer>
      )}
      {assignee && (
        <BlockContainer>
          <UiTextWithIcon text={assigneeName}>
            <UiIcon.UserInCircle />
          </UiTextWithIcon>
        </BlockContainer>
      )}
      <UiGrid gapH={2}>
        <UiGrid.Col>
          <SubtaskList subtasks={subtasks} onClick={(subtask) => setSelectedSubtaskId(subtask.id)}
                       activeSubtask={selectedSubtask} />
        </UiGrid.Col>
        <UiGrid.Col>
          {selectedSubtask !== null && (
            <SubtaskView incident={incident} report={report} task={task} subtask={selectedSubtask} />
          )}
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

  const [subtasks, subtaskError]: BackendResponse<Subtask[]> = await BackendService.list(
    `incidents/${incidentId}/reports/${reportId}/tasks/${taskId}/subtasks`,
  )
  if (subtaskError !== null) {
    throw subtaskError
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
        subtasks,
        users,
      },
    },
  }
}

const StyledDiv = styled.div`
  display: flex;
  justify-content: space-between;
`
const HorizontalSpacer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const VerticalSpacer = styled.div`
  width: 100%;
  margin-bottom: 1rem;

  :last-child {
    margin-bottom: 0;
  }
`

const BlockContainer = styled.div`
  width: 100%;
`