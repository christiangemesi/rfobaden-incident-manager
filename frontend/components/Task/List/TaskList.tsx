import React from 'react'
import Task/*, { parseTask }*/ from '@/models/Task'
import styled from 'styled-components'
import { useUser } from '@/stores/UserStore'

interface Props {
  tasks: Task[]
}

const TaskList: React.VFC<Props> = ({ tasks }) => {
  return (
    <div></div>
  )

}
export default TaskList

interface TaskListItemProps {
  task: Task
  onEdit?: (task: Task) => void
}


const TaskListItem: React.VFC<TaskListItemProps> = ({ task }) => {
  const assignee = useUser(task.assigneeId)

  return (
    <div></div>
  )
}


const StyledTable = styled.div`

`


