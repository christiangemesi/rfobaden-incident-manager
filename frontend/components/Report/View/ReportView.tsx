import Report, { parseReport } from '@/models/Report'
import React, { useCallback, useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import TaskList from '@/components/Task/List/TaskList'
import TaskStore, { useTasksOfReport } from '@/stores/TaskStore'
import BackendService, { BackendResponse } from '@/services/BackendService'
import ReportStore from '@/stores/ReportStore'
import UiIconButtonGroup from '@/components/Ui/Icon/Button/Group/UiIconButtonGroup'
import UiIconButton from '@/components/Ui/Icon/Button/UiIconButton'
import UiModal from '@/components/Ui/Modal/UiModal'
import ReportForm from '@/components/Report/Form/ReportForm'
import { useAsync } from 'react-use'
import Id from '@/models/base/Id'
import Task, { parseTask } from '@/models/Task'
import TaskView from '@/components/Task/View/TaskView'
import UiDropDown from '@/components/Ui/DropDown/UiDropDown'
import { Themed } from '@/theme'
import UiContainer from '@/components/Ui/Container/UiContainer'
import UiScroll from '@/components/Ui/Scroll/UiScroll'
import TaskForm from '@/components/Task/Form/TaskForm'
import { sleep } from '@/utils/control-flow'
import UiDescription from '@/components/Ui/Description/UiDescription'
import useBreakpoint from '@/utils/hooks/useBreakpoints'
import EventHelper from '@/utils/helpers/EventHelper'
import ReportInfo from '@/components/Report/Info/ReportInfo'
import Incident from '@/models/Incident'

interface Props {
  incident: Incident
  report: Report
  onClose?: () => void
}

const ReportView: React.VFC<Props> = ({ incident, report, onClose: handleCloseView }) => {
  const tasks = useTasksOfReport(report.id)
  const { loading: isLoading } = useAsync(async () => {
    if (loadedReports.has(report.id)) {
      return
    }
    await sleep(300)
    const [tasks, error]: BackendResponse<Task[]> = await BackendService.list(
      `incidents/${report.incidentId}/reports/${report.id}/tasks`,
    )
    if (error !== null) {
      throw error
    }
    TaskStore.saveAll(tasks.map(parseTask))
    loadedReports.add(report.id)
  }, [report.id])

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

  const canDeselectByClick = useBreakpoint(() => ({
    xs: true,
    xl: false,
  }))
  const handleDeselectByClick = useCallback(() => {
    if (canDeselectByClick) {
      setSelected(null)
    }
  }, [canDeselectByClick])

  return (
    <Container>
      <Heading onClick={handleDeselectByClick}>
        <UiGrid justify="space-between" align="start" gap={1} style={{ flexWrap: 'nowrap' }}>
          <div>
            <ReportInfo report={report} />
            <UiTitle level={3}>
              {report.title}
            </UiTitle>
          </div>
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
                    Neuer Auftrag
                  </UiDropDown.Item>
                )}</UiModal.Activator>
                <UiModal.Body>{({ close }) => (
                  <div>
                    <UiTitle level={1} isCentered>
                      Auftrag erfassen
                    </UiTitle>
                    <TaskForm report={report} onClose={close} />
                  </div>
                )}</UiModal.Body>
              </UiModal>

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

        <UiDescription description={report.description} notes={report.notes} />
      </Heading>
      <Content onClick={EventHelper.stopPropagation}>
        <UiScroll style={{ height: '100%' }}>
          <TaskContainer>
            {isLoading ? (
              <UiIcon.Loader isSpinner />
            ) : (
              <TaskList
                tasks={tasks}
                onClick={selectTask}
              />
            )}
          </TaskContainer>
        </UiScroll>
        <TaskOverlay hasSelected={selected !== null}>
          {selected && (
            <TaskView report={report} task={selected} onClose={clearSelected} />
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
  row-gap: 0.5rem;
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
    padding-right: 0;
  }
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
  left: 0;
  z-index: 2;

  width: calc(100%);
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
