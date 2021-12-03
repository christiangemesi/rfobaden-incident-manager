import React from 'react'
import Task from '@/models/Task'
import styled from 'styled-components'
import { useUser } from '@/stores/UserStore'
import UiList from '@/components/Ui/List/UiList'
import UiListItemWithDetails from '@/components/Ui/List/Item/WithDetails/UiListItemWithDetails'

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

  return (
    <UiListItemWithDetails
      title={task.title}
      priority={task.priority}
      user={assigneeName}
      onClick={handleClick && (() => handleClick(task))}
    >
      <StyledDiv>
        0/0
        {/*TODO number of subtasks*/}
      </StyledDiv>
    </UiListItemWithDetails>
  )
}

const StyledDiv = styled.div`
  > div {
    margin-left: 1rem;
  }
`

