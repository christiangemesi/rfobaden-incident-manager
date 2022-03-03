import Report, { parseReport } from '@/models/Report'
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
import UiDropDown from '@/components/Ui/DropDown/UiDropDown'
import { Themed } from '@/theme'
import UiContainer from '@/components/Ui/Container/UiContainer'
import UiScroll from '@/components/Ui/Scroll/UiScroll'

interface Props {
  report: Report
  onClose?: () => void
}

const ReportView: React.VFC<Props> = ({ report, onClose: handleCloseView }) => {
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

  const handleDelete = useCallback(async () => {
    if (confirm(`Sind sie sicher, dass sie die Meldung "${report.title}" löschen wollen?`)) {
      await BackendService.delete(`incidents/${report.incidentId}/reports`, report.id)
      ReportStore.remove(report.id)
      if (handleCloseView) {
        handleCloseView()
      }
    }
  }, [report, handleCloseView])

  const handleClose = useCallback(async () => {
    if (report.isDone) {
      alert('Es sind alle Aufträge geschlossen.')
      return
    }
    if (confirm(`Sind sie sicher, dass sie die Meldung "${report.title}" schliessen wollen?`)) {
      const newReport = { ...report, isClosed: true }
      const [data, error]: BackendResponse<Report> = await BackendService.update(`incidents/${report.incidentId}/reports`, report.id, newReport)
      if (error !== null) {
        throw error
      }
      ReportStore.save(parseReport(data))
    }
  }, [report])

  const handleReopen = useCallback(async () => {
    if (confirm(`Sind sie sicher, dass sie die Meldung "${report.title}" öffnen wollen?`)) {
      const newReport = { ...report, isClosed: false }
      const [data, error]: BackendResponse<Report> = await BackendService.update(`incidents/${report.incidentId}/reports`, report.id, newReport)
      if (error !== null) {
        throw error
      }
      ReportStore.save(parseReport(data))
    }
  }, [report])


  const startDate = report.startsAt !== null ? report.startsAt : report.createdAt
  const incident = useIncident(report.incidentId)
  if (incident === null) {
    throw new Error('incident of report not found')
  }

  const [selected, setSelected] = useState<Task | null>()
  const selectTask = useCallback((task: Task) => {
    setSelected(task)
  }, [])
  const clearSelected = useCallback(() => {
    setSelected(null)
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
            <UiDropDown>
              <UiDropDown.Trigger>
                <UiIconButton>
                  <UiIcon.More />
                </UiIconButton>
              </UiDropDown.Trigger>
              <UiModal isFull>
                <UiModal.Activator>{({ open }) => (
                  <UiDropDown.Item onClick={open}>
                    Bearbeiten
                  </UiDropDown.Item>
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
              {!report.isDone && (
                report.isClosed ? (
                  <UiDropDown.Item onClick={handleReopen}>
                    Öffnen
                  </UiDropDown.Item>
                ) : (
                  <UiDropDown.Item onClick={handleClose}>
                    Schliessen
                  </UiDropDown.Item>
                )
              )}

              <UiDropDown.Item onClick={handleDelete}>
                Löschen
              </UiDropDown.Item>
            </UiDropDown>

            <UiIconButton onClick={handleCloseView}>
              <UiIcon.CancelAction />
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
      <Content>
        <UiScroll style={{ height: '100%' }}>
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
        </UiScroll>
        <TaskOverlay hasSelected={selected !== null}>
          {selected && (
            <TaskView task={selected} onClose={clearSelected} />
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
  padding: 1rem 4rem 0 2rem;
  display: flex;
  flex-direction: column;
  width: 100%;
  
  ${Themed.media.lg.max} {
    padding: 0;
    ${UiContainer.fluidCss};
  }
`

const Content = styled.div`
  position: relative;
  flex: 1;
  height: 100%;
  padding-top: 1rem;
  padding-right: 4rem;

  ${Themed.media.lg.max} {
    padding: 0;
  }
`

const TextLines = styled.div`
  white-space: pre-wrap;
  line-height: 1.2;
`

const TaskContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  padding: 0 2rem 1rem 2rem;
  margin-right: 4rem;
  width: 100%;
  
  ${Themed.media.lg.max} {
    padding: 0;
    ${UiContainer.fluidCss};
  }
`

const TaskOverlay = styled.div<{ hasSelected: boolean }>`
  position: absolute;
  top: 0;
  left: 2rem;
  
  z-index: 2;
  
  width: calc(100% - 2rem);
  height: 100%;
  
  background-color: ${({ theme }) => theme.colors.tertiary.value};
  box-shadow: 0 0 4px 2px gray;

  will-change: transform;
  transition: 300ms cubic-bezier(.23,1,.32,1);
  transition-property: transform;
  
  transform: translateY(100%);
  transform-origin: bottom;
  
  margin-top: 1rem;
  padding: 1rem 4rem 1rem 2rem;
  
  ${({ hasSelected }) => hasSelected && css`
    transform: translateY(0);
  `}
  
  ${Themed.media.lg.max} {
    ${UiContainer.fluidCss};
    left: 0;
    width: 100%;
  }
`