import Subtask from '@/models/Subtask'
import React, { useState } from 'react'
import { useUser } from '@/stores/UserStore'
import UiListItemWithDetails from '@/components/Ui/List/Item/WithDetails/UiListItemWithDetails'
import Priority from '@/models/Priority'
import UiCheckbox from '@/components/Ui/Checkbox/UiCheckbox'

interface TaskListItemProps {
  subtask: Subtask,
  isActive: boolean,
  onClick?: (Subtask: Subtask) => void,
}

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

export default SubtaskListItem