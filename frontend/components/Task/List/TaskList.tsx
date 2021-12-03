import React from 'react'
import Task from '@/models/Task'
import styled from 'styled-components'
import { useUser } from '@/stores/UserStore'
import UiList from '@/components/Ui/List/UiList'
import UiListItemWithDetails from '@/components/Ui/List/Item/WithDetails/UiListItemWithDetails'
import Link from 'next/link'

interface Props {
  tasks: Task[]
  onClick?: (task: Task) => void
}

const TaskList: React.VFC<Props> = ({ tasks, onClick: handleClick }) => {
  return (
    <UiList>
      {tasks.map((task) => (
        <Link key={task.id} href={`/ereignisse/${task.incidentId}/meldungen/${task.reportId}/auftraege/${task.id}/unterauftraege`}>
          <a>
            <TaskListItem task={task} onClick={handleClick} />
          </a>
        </Link>
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
  const assigneeName = assignee ? assignee.firstName + ' ' + assignee.lastName : ''

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

