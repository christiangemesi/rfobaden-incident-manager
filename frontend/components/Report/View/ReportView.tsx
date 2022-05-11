import Report from '@/models/Report'
import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import TaskList from '@/components/Task/List/TaskList'
import { useTask, useTasksOfReport } from '@/stores/TaskStore'
import { useAsync, useMeasure, useUpdateEffect } from 'react-use'
import Id from '@/models/base/Id'
import Task from '@/models/Task'
import TaskView from '@/components/Task/View/TaskView'
import { Themed } from '@/theme'
import UiContainer from '@/components/Ui/Container/UiContainer'
import { sleep } from '@/utils/control-flow'
import Incident from '@/models/Incident'
import UiLevel from '@/components/Ui/Level/UiLevel'
import UiInlineDrawer from '@/components/Ui/InlineDrawer/UiInlineDrawer'
import useCachedEffect from '@/utils/hooks/useCachedEffect'
import { useRouter } from 'next/router'
import { parseIncidentQuery } from '@/pages/ereignisse/[...path]'
import ReportViewHeader from '@/components/Report/View/Header/ReportViewHeader'
import BackendFetchService from '@/services/BackendFetchService'

interface Props {
  incident: Incident
  report: Report
  onClose?: () => void
}

const ReportView: React.VFC<Props> = ({ incident, report, onClose: handleClose }) => {
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
  const isLoading = useCachedEffect('report/tasks', report.id, async () => {
    // Wait for any animations to play out before fetching data.
    // The load is a relatively expensive operation, and may interrupt some animations.
    await sleep(300)
    await BackendFetchService.loadTasksOfReport(report)
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
        <ReportViewHeader incident={incident} report={report} onClose={handleClose} />
      </UiLevel.Header>

      <AnimatedUiLevelContent style={{ minHeight: selected === null ? 0 : taskViewHeight }} noPadding>
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
  
  padding: 0 2rem;
  ${Themed.media.xs.only} {
    padding-left: 0.8rem;
    padding-right: 0.8rem;
  }
`
