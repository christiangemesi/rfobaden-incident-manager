import Report from '@/models/Report'
import React, { useCallback, useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UiDateLabel from '@/components/Ui/DateLabel/UiDateLabel'
import UiTextWithIcon from '@/components/Ui/TextWithIcon/UiTextWithIcon'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import TaskList from '@/components/Task/List/TaskList'
import TaskStore, { useTasksOfReport } from '@/stores/TaskStore'
import BackendService, { BackendResponse } from '@/services/BackendService'
import ReportStore from '@/stores/ReportStore'
import UiIconButtonGroup from '@/components/Ui/Icon/Button/Group/UiIconButtonGroup'
import UiIconButton from '@/components/Ui/Icon/Button/UiIconButton'
import { useUser } from '@/stores/UserStore'
import UiModal from '@/components/Ui/Modal/UiModal'
import { useIncident } from '@/stores/IncidentStore'
import ReportForm from '@/components/Report/Form/ReportForm'
import { useAsync } from 'react-use'
import Id from '@/models/base/Id'
import Task, { parseTask } from '@/models/Task'
import TaskView from '@/components/Task/View/TaskView'

interface Props {
  report: Report
}

const ReportView: React.VFC<Props> = ({ report }) => {
  const tasks = useTasksOfReport(report.id)
  const { loading: isLoading } = useAsync(async () => {
    if (loadedReports.has(report.id)) {
      return
    }
    const [tasks, error]: BackendResponse<Task[]> = await BackendService.list(
      `incidents/${report.incidentId}/reports/${report.id}/tasks`,
    )
    if (error !== null) {
      throw error
    }
    TaskStore.saveAll(tasks.map(parseTask))
    loadedReports.add(report.id)
  }, [report.id])

  const assignee = useUser(report.assigneeId)
  const assigneeName = assignee?.firstName + ' ' + assignee?.lastName ?? ''

  const handleDelete = async () => {
    if (confirm(`Sind sie sicher, dass sie die Meldung "${report.title}" löschen wollen?`)) {
      await BackendService.delete(`incidents/${report.incidentId}/reports`, report.id)

      ReportStore.remove(report.id)
    }
  }

  const startDate = report.startsAt !== null ? report.startsAt : report.createdAt

  const incident = useIncident(report.incidentId)
  if (incident === null) {
    throw new Error('incident of report not found')
  }

  const [selected, setSelected] = useState<Task | null>()
  const selectTask = useCallback((task: Task) => {
    setSelected(task)
  }, [])

  useEffect(() => {
    setSelected(null)
  }, [report.id])

  return (
    <Container>
      <Heading onClick={() => setSelected(null)}>
        <UiGrid justify="space-between" align="center">
          <UiTitle level={3}>
            {report.title}
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
                    Meldung bearbeiten
                  </UiTitle>
                  <ReportForm incident={incident} report={report} onClose={close} />
                </React.Fragment>
              )}</UiModal.Body>
            </UiModal>

            <UiIconButton onClick={handleDelete}>
              <UiIcon.DeleteAction />
            </UiIconButton>
          </UiIconButtonGroup>
        </UiGrid>
        <UiDateLabel start={startDate} end={report.endsAt} />
        <TextLines>
          {report.description}
        </TextLines>

        {report.location && (
          <UiTextWithIcon text={report.location ?? ''}>
            <UiIcon.Location />
          </UiTextWithIcon>
        )}
        {assignee && (
          <UiTextWithIcon text={assigneeName}>
            <UiIcon.UserInCircle />
          </UiTextWithIcon>
        )}
        {report.notes !== null && (
          <UiTextWithIcon text={report.notes}>
            <UiIcon.AlertCircle />
          </UiTextWithIcon>
        )}
      </Heading>
      <Content hasSelected={selected !== null}>
        <TaskContainer>
          {isLoading ? (
            <UiIcon.Loader isSpinner />
          ) : (
            <TaskList
              incident={incident}
              report={report}
              tasks={tasks}
              onClick={selectTask}
            />
          )}
        </TaskContainer>
        <TaskOverlay hasSelected={selected !== null}>
          {selected && (
            <TaskView task={selected} />
          )}
        </TaskOverlay>
      </Content>
    </Container>
  )
}
export default ReportView

const loadedReports = new Set<Id<Report>>()

const Container = styled.div`
  display: flex;
  flex-direction: column;
  
  width: 100%;
  height: 100%;
`

const Heading = styled.div`
  padding: 1rem 2rem 0 2rem;
  display: flex;
  flex-direction: column;
  width: 100%;
`

const Content = styled.div<{ hasSelected: boolean }>`
  position: relative;
  flex: 1;
  height: 100%;
  
  ${({ hasSelected }) => css`
    overflow: ${hasSelected ? 'hidden' : 'auto'};
  `}
`

const TextLines = styled.div`
  white-space: pre-wrap;
  line-height: 1.2;
`

const TaskContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 1rem 2rem 1rem 2rem;
  width: 100%;
`

const TaskOverlay = styled.div<{ hasSelected: boolean }>`
  position: absolute;
  top: 0;
  left: 1rem;
  
  z-index: 2;
  
  width: calc(100% - 1rem);
  height: 100%;
  
  background-color: ${({ theme }) => theme.colors.tertiary.value};
  box-shadow: 0 0 4px 2px gray;
  
  transition: 150ms ease-out;
  transition-property: transform;
  
  transform: scaleY(0);
  transform-origin: bottom;
  
  margin-top: 1rem;
  padding: 1rem 2rem 1rem 2rem;
  
  ${({ hasSelected }) => hasSelected && css`
    transform: scaleY(1);
  `}
`