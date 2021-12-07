import React from 'react'
import Task from '@/models/Task'
import UiList from '@/components/Ui/List/UiList'
import UiLink from '@/components/Ui/Link/UiLink'
import TaskListItem from '@/components/Task/List/Item/TaskListItem'

interface Props {
  tasks: Task[]
  onClick?: (task: Task) => void
}

const TaskList: React.VFC<Props> = ({ tasks, onClick: handleClick }) => {
  return (
    <UiList>
      {tasks.map((task) => (
        <UiLink key={task.id} href={`/ereignisse/${task.incidentId}/meldungen/${task.reportId}/auftraege/${task.id}/unterauftraege`}>
          <TaskListItem task={task} onClick={handleClick} />
        </UiLink>
      ))}
    </UiList>
  )

}
export default TaskList


