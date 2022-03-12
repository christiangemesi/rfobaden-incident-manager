import Report, { parseReport } from '@/models/Report'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
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
import { useAsync, useMeasure, useUpdateEffect } from 'react-use'
import Id from '@/models/base/Id'
import Task, { parseTask } from '@/models/Task'
import TaskView from '@/components/Task/View/TaskView'
import UiDropDown from '@/components/Ui/DropDown/UiDropDown'
import { Themed } from '@/theme'
import UiContainer from '@/components/Ui/Container/UiContainer'
import TaskForm from '@/components/Task/Form/TaskForm'
import { sleep } from '@/utils/control-flow'
import UiDescription from '@/components/Ui/Description/UiDescription'
import useBreakpoint from '@/utils/hooks/useBreakpoints'
import EventHelper from '@/utils/helpers/EventHelper'
import ReportInfo from '@/components/Report/Info/ReportInfo'
import Incident from '@/models/Incident'
import UiLevel from '@/components/Ui/Level/UiLevel'
import UiInlineDrawer from '@/components/Ui/InlineDrawer/UiInlineDrawer'
import useAsyncCached from '@/utils/hooks/useAsyncCached'

interface Props {
  incident: Incident
  report: Report
  onClose?: () => void
}

const ReportView: React.VFC<Props> = ({ incident, report, onClose: handleCloseView }) => {
  const tasks = useTasksOfReport(report.id)
  
  const [selected, setSelected] = useState<Task | null>(null)
  const clearSelected = useCallback(() => {
    setSelected(null)
  }, [])

  const [setTaskViewRef, { height: taskViewHeight }] = useMeasure<HTMLDivElement>()

  // Load tasks from the backend.
  const { loading: isLoading } = useAsyncCached(ReportView, report.id, async () => {
    // Wait for any animations to play out before fetching data.
    // The load is a relatively expensive operation, and may interrupt some animations.
    await sleep(300)

    const [tasks, error]: BackendResponse<Task[]> = await BackendService.list(
      `incidents/${report.incidentId}/reports/${report.id}/tasks`,
    )
    if (error !== null) {
      throw error
    }
    TaskStore.saveAll(tasks.map(parseTask))
  })

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

  // Clear the selected task if the report changes.
  // Two reports never contain the same task.
  useUpdateEffect(clearSelected, [report.id])

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
    <UiLevel>
      <UiLevel.Header onClick={handleDeselectByClick}>
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
      </UiLevel.Header>

      <AnimatedUiLevelContent onClick={EventHelper.stopPropagation} style={{ minHeight: selected === null ? 0 : taskViewHeight }}>
        <TaskContainer>
          {isLoading ? (
            <UiIcon.Loader isSpinner />
          ) : (
            <TaskList
              tasks={tasks}
              onClick={setSelected}
            />
          )}
        </TaskContainer>
        <UiInlineDrawer isOpen={selected !== null} onClose={clearSelected}>
          {selected && (
            <TaskView innerRef={setTaskViewRef} report={report} task={selected} onClose={clearSelected} />
          )}
        </UiInlineDrawer>
      </AnimatedUiLevelContent>
    </UiLevel>
  )
}
export default ReportView

const AnimatedUiLevelContent = styled(UiLevel.Content)`
  transition: 300ms cubic-bezier(0.23, 1, 0.32, 1);
  transition-property: min-height;
`

const TaskContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;
  
  ${Themed.media.lg.max} {
    padding: 0;
    ${UiContainer.fluidCss};
  }
`
