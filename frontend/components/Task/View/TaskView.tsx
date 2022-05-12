import Task from '@/models/Task'
import React, { Ref } from 'react'
import SubtaskList from '@/components/Subtask/List/SubtaskList'
import { useSubtasksOfTask } from '@/stores/SubtaskStore'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import styled, { css } from 'styled-components'
import Report from '@/models/Report'
import UiLevel from '@/components/Ui/Level/UiLevel'
import useCachedEffect from '@/utils/hooks/useCachedEffect'
import { sleep } from '@/utils/control-flow'
import TaskViewHeader from '@/components/Task/View/Header/TaskViewHeader'
import BackendFetchService from '@/services/BackendFetchService'

interface Props {
  report: Report
  task: Task
  onClose?: () => void
  innerRef?: Ref<HTMLDivElement>
}

const TaskView: React.VFC<Props> = ({ report, task, innerRef, onClose: handleClose }) => {
  const subtasks = useSubtasksOfTask(task.id)

  // Load subtasks from the backend.
  const isLoading = useCachedEffect('task/subtasks', task.id, async () => {
    // Wait for any animations to play out before fetching data.
    // The load is a relatively expensive operation, and may interrupt some animations.
    await sleep(300)
    await BackendFetchService.loadSubtasksOfTask(task)
  })

  return (
    <StyledLevel ref={innerRef} isClosed={report.isClosed || report.isDone || task.isClosed || task.isDone}>
      <UiLevel.Header>
        <TaskViewHeader report={report} task={task} onClose={handleClose} />
      </UiLevel.Header>

      <Content>
        {isLoading ? (
          <UiIcon.Loader isSpinner />
        ) : (
          <SubtaskList task={task} subtasks={subtasks} />
        )}
      </Content>
    </StyledLevel>
  )
}
export default TaskView

const StyledLevel = styled(UiLevel)<{ isClosed: boolean }>`
  ${({ isClosed }) => isClosed && css`
    background-color: ${({ theme }) => theme.colors.grey.value};
    
  `}
`

const Content = styled(UiLevel.Content)`
  display: flex;
  justify-content: center;
`
