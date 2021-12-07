import Task from '@/models/Task'
import React, { useState } from 'react'
import UiList from '@/components/Ui/List/UiList'
import Priority from '@/models/Priority'
import UiCheckbox from '@/components/Ui/Checkbox/UiCheckbox'
import { useUser } from '@/stores/UserStore'
import UiListItemWithDetails from '@/components/Ui/List/Item/WithDetails/UiListItemWithDetails'

// TODO Change to Subtask.
interface Props {
  subtasks: Task[]
  activeSubtask: Task | null
  onClick?: (task: Task) => void
}

const SubtaskList: React.VFC<Props> = ({ subtasks, activeSubtask, onClick: handleClick }) => {
  return (
    <UiList>
      {subtasks.map((subtask) => (
        <SubtaskListItem key={subtask.id} subtask={subtask} onClick={handleClick} isActive={activeSubtask === subtask} />
      ))}
    </UiList>
  )
}
export default SubtaskList

interface TaskListItemProps {
  subtask: Task,
  isActive: boolean,
  onClick?: (Task: Task) => void,
}

// TODO implement subtask functionality.
const SubtaskListItem: React.VFC<TaskListItemProps> = ({ subtask, onClick: _handleClick }) => {

  const assignee = useUser(subtask.assigneeId)
  const assigneeName = assignee?.firstName + ' ' + assignee?.lastName ?? ''

  const [value, setValue] = useState(false)

  return (
    <UiListItemWithDetails priority={Priority.LOW} title={subtask.title} user={assigneeName}>
      <UiCheckbox label="" value={value} onChange={setValue} color="tertiary" />
    </UiListItemWithDetails>
  )
}
