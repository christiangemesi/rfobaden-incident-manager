import React from 'react'
import Task from '@/models/Task'
import UiList from '@/components/Ui/List/UiList'
import TaskListItem from '@/components/Task/List/Item/TaskListItem'

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
