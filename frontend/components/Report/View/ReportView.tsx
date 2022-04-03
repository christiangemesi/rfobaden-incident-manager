import Report from '@/models/Report'
import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import TaskList from '@/components/Task/List/TaskList'
import TaskStore, { useTask, useTasksOfReport } from '@/stores/TaskStore'
import BackendService, { BackendResponse } from '@/services/BackendService'
import UiIconButtonGroup from '@/components/Ui/Icon/Button/Group/UiIconButtonGroup'
import UiIconButton from '@/components/Ui/Icon/Button/UiIconButton'
import { useAsync, useMeasure, useUpdateEffect } from 'react-use'
import Id from '@/models/base/Id'
import Task, { parseTask } from '@/models/Task'
import TaskView from '@/components/Task/View/TaskView'
import { Themed } from '@/theme'
import UiContainer from '@/components/Ui/Container/UiContainer'
import { sleep } from '@/utils/control-flow'
import UiDescription from '@/components/Ui/Description/UiDescription'
import ReportInfo from '@/components/Report/Info/ReportInfo'
import Incident from '@/models/Incident'
import UiLevel from '@/components/Ui/Level/UiLevel'
import UiInlineDrawer from '@/components/Ui/InlineDrawer/UiInlineDrawer'
import useCachedEffect from '@/utils/hooks/useCachedEffect'
import ReportActions from '@/components/Report/Actions/ReportActions'
import { useRouter } from 'next/router'
import { parseIncidentQuery } from '@/pages/ereignisse/[...path]'

interface Props {
  incident: Incident
  report: Report
  onClose?: () => void
}

const ReportView: React.VFC<Props> = ({ incident, report, onClose: handleCloseView }) => {
  const router = useRouter()
  const tasks = useTasksOfReport(report.id)

  const [selectedId, setSelectedId] = useState<Id<Task> | null>(() => {
    const query = parseIncidentQuery(router.query)
    return query === null || query.mode !== 'task'
      ? null
      : query.taskId
  })

  const selected = useTask(selectedId)
  const setSelected = useCallback((task: Task | null) => {
    setSelectedId(task?.id ?? null)
  }, [])
  const clearSelected = useCallback(() => {
    setSelectedId(null)
  }, [])

  const [setTaskViewRef, { height: taskViewHeight }] = useMeasure<HTMLDivElement>()

  // Load tasks from the backend.
  const isLoading = useCachedEffect(ReportView, report.id, async () => {
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

  // Clear the selected task if the report changes.
  // Two reports never contain the same task.
  useUpdateEffect(clearSelected, [report.id])

  useAsync(async function updateRoute() {
    const query = parseIncidentQuery(router.query)
    if (query === null) {
      return
    }
    if (selected === null) {
      if (query.mode !== 'report') {
        await router.push(`/ereignisse/${report.incidentId}/meldungen/${report.id}`, undefined, { shallow: true })
      }
      return
    }
    if (query.mode !== 'task' || query.taskId !== selected.id) {
      await router.push(`/ereignisse/${selected.incidentId}/meldungen/${selected.reportId}/auftraege/${selected.id}`, undefined, { shallow: true })
    }
  }, [report, router, selected])

  return (
    <UiLevel>
      <UiLevel.Header>
        <UiGrid justify="space-between" align="start" gap={1} style={{ flexWrap: 'nowrap' }}>
          <div>
            <ReportInfo report={report} />
            <UiTitle level={3}>
              {report.title}
            </UiTitle>
          </div>
          <UiIconButtonGroup>
            <ReportActions incident={incident} report={report} onDelete={handleCloseView} />

            <UiIconButton onClick={handleCloseView}>
              <UiIcon.CancelAction />
            </UiIconButton>
          </UiIconButtonGroup>
        </UiGrid>

        <UiDescription description={report.description} notes={report.notes} />
      </UiLevel.Header>

      <AnimatedUiLevelContent style={{ minHeight: selected === null ? 0 : taskViewHeight }}>
        <TaskContainer>
          {isLoading ? (
            <UiIcon.Loader isSpinner />
          ) : (
            <TaskList
              report={report}
              tasks={tasks}
              onSelect={setSelected}
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
