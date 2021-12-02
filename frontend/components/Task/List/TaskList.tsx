

import React from 'react'
import Task/*, { parseTask }*/ from '@/models/Task'
import styled from 'styled-components'
import { useUser } from '@/stores/UserStore'
import UiList from '@/components/Ui/List/UiList'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiListItemWithDetails from '@/components/Ui/List/Item/WithDetails/UiListItemWithDetails'
import { useTasksOfReport } from '@/stores/TaskStore'

interface Props {
  tasks: Task[]
  onClick?: (task: Task) => void
}

const TaskList: React.VFC<Props> = ({ tasks, onClick: handleClick }) => {
  return (
    <UiList>
      {tasks.map((task) => (
        <TaskListItem key={task.id} task={task} onClick={handleClick} />
      ))}
    </UiList>
  )

}
export default TaskList

interface TaskListItemProps {
  task: Task
  onClick?: (task: Task) => void
}

const TaskListItem: React.VFC<TaskListItemProps> = ({ task, onClick: handleClick }) => {
  const assignee = useUser(task.assigneeId)
  const assigneeName = assignee?.firstName + ' ' + assignee?.lastName ?? ''

  const subTasksAll = useTasksOfReport(task.id)
  const subTasksDone = subTasksAll.filter((subTask) => subTask.closedAt !== null)

  return (
    <UiListItemWithDetails title={task.title} priority={task.priority} user={assigneeName}
      onClick={handleClick && (() => handleClick(task))}>
      <StyledDiv>
        <UiIcon.KeyMessage />
      </StyledDiv>
      <StyledDiv>
        <UiIcon.LocationRelevancy />
      </StyledDiv>
      <StyledDiv>
        {subTasksDone}/{subTasksAll}
      </StyledDiv>
    </UiListItemWithDetails>
  )
}

const StyledDiv = styled.div`
  > div {
    margin-left: 1rem;
  }
`

