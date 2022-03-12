import Task, { parseTask } from '@/models/Task'
import React, { Ref, RefObject, useCallback } from 'react'
import UiTitle from '@/components/Ui/Title/UiTitle'
import SubtaskList from '@/components/Subtask/List/SubtaskList'
import SubtaskStore, { useSubtasksOfTask } from '@/stores/SubtaskStore'
import Id from '@/models/base/Id'
import { useAsync } from 'react-use'
import BackendService, { BackendResponse } from '@/services/BackendService'
import Subtask, { parseSubtask } from '@/models/Subtask'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiIconButton from '@/components/Ui/Icon/Button/UiIconButton'
import UiModal from '@/components/Ui/Modal/UiModal'
import TaskForm from '@/components/Task/Form/TaskForm'
import UiDropDown from '@/components/Ui/DropDown/UiDropDown'
import TaskStore from '@/stores/TaskStore'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiIconButtonGroup from '@/components/Ui/Icon/Button/Group/UiIconButtonGroup'
import styled from 'styled-components'
import UiScroll from '@/components/Ui/Scroll/UiScroll'
import SubtaskForm from '@/components/Subtask/Form/SubtaskForm'
import UiDescription from '@/components/Ui/Description/UiDescription'
import EventHelper from '@/utils/helpers/EventHelper'
import Report from '@/models/Report'
import TaskInfo from '@/components/Task/Info/TaskInfo'
import UiLevel from '@/components/Ui/Level/UiLevel'
import useAsyncCached from '@/utils/hooks/useAsyncCached'
import { sleep } from '@/utils/control-flow'
import TaskActions from '@/components/Task/Actions/TaskActions'

interface Props {
  report: Report
  task: Task
  onClose?: () => void
  innerRef?: Ref<HTMLDivElement>
}

const TaskView: React.VFC<Props> = ({ report, task, innerRef, onClose: handleCloseView }) => {
  const subtasks = useSubtasksOfTask(task.id)

  // Load subtasks from the backend.
  const { loading: isLoading } = useAsyncCached(TaskView, task.id, async () => {
    // Wait for any animations to play out before fetching data.
    // The load is a relatively expensive operation, and may interrupt some animations.
    await sleep(300)
    const [subtasks, error]: BackendResponse<Subtask[]> = await BackendService.list(
      `incidents/${task.incidentId}/reports/${task.reportId}/tasks/${task.id}/subtasks`,
    )
    if (error !== null) {
      throw error
    }
    SubtaskStore.saveAll(subtasks.map(parseSubtask))
  })

  return (
    <UiLevel ref={innerRef}>
      <UiLevel.Header onClick={EventHelper.stopPropagation}>
        <UiGrid justify="space-between" align="start" gap={1} style={{ flexWrap: 'nowrap' }}>
          <div>
            <TaskInfo task={task} />
            <UiTitle level={4}>
              {task.title}
            </UiTitle>
          </div>

          <UiIconButtonGroup>
            <TaskActions report={report} task={task} />

            <UiIconButton onClick={handleCloseView}>
              <UiIcon.CancelAction />
            </UiIconButton>
          </UiIconButtonGroup>
        </UiGrid>

        <UiDescription description={task.description} />
      </UiLevel.Header>

      <Content>
        {isLoading  ? (
          <UiIcon.Loader isSpinner />
        ) : (
          <SubtaskList task={task} subtasks={subtasks} />
        )}
      </Content>
    </UiLevel>
  )
}
export default TaskView

const Content = styled(UiLevel.Content)`
  display: flex;
  justify-content: center;
`
