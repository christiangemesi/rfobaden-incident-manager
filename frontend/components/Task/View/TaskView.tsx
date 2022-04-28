import Task from '@/models/Task'
import React, { Ref } from 'react'
import SubtaskList from '@/components/Subtask/List/SubtaskList'
import SubtaskStore, { useSubtasksOfTask } from '@/stores/SubtaskStore'
import BackendService, { BackendResponse } from '@/services/BackendService'
import Subtask, { parseSubtask } from '@/models/Subtask'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import styled from 'styled-components'
import Report from '@/models/Report'
import UiLevel from '@/components/Ui/Level/UiLevel'
import useCachedEffect from '@/utils/hooks/useCachedEffect'
import { sleep } from '@/utils/control-flow'
import TaskViewHeader from '@/components/Task/View/Header/TaskViewHeader'

interface Props {
  report: Report
  task: Task
  onClose?: () => void
  innerRef?: Ref<HTMLDivElement>
}

const TaskView: React.VFC<Props> = ({ report, task, innerRef, onClose: handleClose }) => {
  const subtasks = useSubtasksOfTask(task.id)

  // Load subtasks from the backend.
  const isLoading = useCachedEffect(TaskView, task.id, async () => {
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
      <UiLevel.Header>
        <TaskViewHeader report={report} task={task} onClose={handleClose} />
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
