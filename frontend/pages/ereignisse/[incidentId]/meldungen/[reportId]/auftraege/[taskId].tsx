import React, { useMemo } from 'react'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import styled from 'styled-components'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UiTextWithIcon from '@/components/Ui/TextWithIcon/UiTextWithIcon'
import User, { parseUser, useUsername } from '@/models/User'
import UiContainer from '@/components/Ui/Container/UiContainer'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import { useEffectOnce } from 'react-use'
import UserStore, { useUser } from '@/stores/UserStore'
import TaskStore, { useTask } from '@/stores/TaskStore'
import { useReport } from '@/stores/ReportStore'
import Report from '@/models/Report'
import Incident from '@/models/Incident'
import { GetServerSideProps } from 'next'
import BackendService, { BackendResponse } from '@/services/BackendService'
import SubtaskList from '@/components/Subtask/List/SubtaskList'
import Task from '@/models/Task'
import { useIncident } from '@/stores/IncidentStore'
import Subtask, { parseSubtask } from '@/models/Subtask'
import SubtaskStore, { useSubtask, useSubtasksOfTask } from '@/stores/SubtaskStore'
import UiDateLabel from '@/components/Ui/DateLabel/UiDateLabel'
import UiIconButtonGroup from '@/components/Ui/Icon/Button/Group/UiIconButtonGroup'
import UiIconButton from '@/components/Ui/Icon/Button/UiIconButton'
import UiModal from '@/components/Ui/Modal/UiModal'
import TaskForm from '@/components/Task/Form/TaskForm'
import SubtaskView from '@/components/Subtask/View/SubtaskView'
import Id from '@/models/base/Id'
import Priority from '@/models/Priority'
import UiBreadcrumb, { Link } from '@/components/Ui/Breadcrumb/UiBreadcrumb'
import { useRouter } from 'next/router'

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

  const router = useRouter()

  const incident = useIncident(data.incident)
  const report = useReport(data.report)
  const task = useTask(data.task)
  const assignee = useUser(task.assigneeId)
  const assigneeName = useUsername(assignee)
  const subtasks = useSubtasksOfTask(task.id)

  const selectedSubtaskIdParam = router.query.subtask
  const selectedSubtaskId = useMemo(() => {
    if (selectedSubtaskIdParam === undefined) {
      return null
    }
    return Array.isArray(selectedSubtaskIdParam)
      ? parseInt(selectedSubtaskIdParam[0])
      : parseInt(selectedSubtaskIdParam)
  }, [selectedSubtaskIdParam])

  const setSelectedSubtaskId = async (id: Id<Subtask> | null) => {
    const query = { ...router.query }
    if (id === null) {
      delete query.subtask
    } else {
      query.subtask = `${id}`
    }
    await router.push({ query }, undefined, { shallow: true })
  }
  const selectedSubtask = useSubtask(selectedSubtaskId)

  const startDate = task.startsAt !== null ? task.startsAt : task.createdAt

  const handleDelete = async () => {
    if (confirm(`Sind sie sicher, dass sie den Auftrag "${task.title}" schliessen wollen?`)) {
      await BackendService.delete(`incidents/${incident.id}/reports/${report.id}/tasks/`, task.id)

      TaskStore.remove(task.id)
    }
  }

  let priorityIcon = <UiIcon.PriorityMedium />
  if (task.priority === Priority.HIGH) {
    priorityIcon = <UiIcon.PriorityHigh />
  } else if (task.priority === Priority.LOW) {
    priorityIcon = <UiIcon.PriorityLow />
  }

  const reportLink = '?report=' + report.id
  const links: Link[] = [
    {
      url: '/ereignisse/' + incident.id,
      label: incident.title,
    },
    {
      url: '/ereignisse/' + incident.id + reportLink,
      label: report.title,
    },
    {
      label: task.title,
    },
  ]

  return (
    <UiContainer>
      <BlockContainer>
        <UiBreadcrumb links={links} />
      </BlockContainer>
      <Details>
        <TitleIconContainer>
          <UiTitle level={1}>
            {task.title}
            <PriorityIcon>
              {priorityIcon}
            </PriorityIcon>
          </UiTitle>

          <UiIconButtonGroup>
            <UiIconButton onClick={() => alert('not yet implemented')}>
              <UiIcon.PrintAction />
            </UiIconButton>
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
            <UiIconButton onClick={handleDelete}>
              <UiIcon.DeleteAction />
            </UiIconButton>
          </UiIconButtonGroup>

        </TitleIconContainer>
        <UiDateLabel start={startDate} end={task.endsAt} />
        <BlockContainer>
          <TextLines>
            {task.description}
          </TextLines>
        </BlockContainer>
        {task.location && (
          <BlockContainer>
            <UiTextWithIcon text={task.location ?? ''}>
              <UiIcon.Location />
            </UiTextWithIcon>
          </BlockContainer>
        )}
        {assigneeName && (
          <BlockContainer>
            <UiTextWithIcon text={assigneeName}>
              <UiIcon.UserInCircle />
            </UiTextWithIcon>
          </BlockContainer>
        )}
      </Details>

      <UiGrid gapH={4}>
        <UiGrid.Col size={{ xs: 12, md: 6, lg: 5 }}>
          <SubtaskList
            incident={incident}
            report={report}
            task={task}
            subtasks={subtasks}
            onClick={(subtask) => setSelectedSubtaskId(subtask.id)}
            activeSubtask={selectedSubtask} />
        </UiGrid.Col>
        <UiGrid.Col size={{ xs: 12, md: true }}>
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

const TitleIconContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
`

const BlockContainer = styled.div`
  width: 100%;
`

const PriorityIcon = styled.span`
  margin-left: 2rem;
`

const TextLines = styled.div`
  white-space: pre-wrap;
  line-height: 1.2;
`