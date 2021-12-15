import React from 'react'
import UiList from '@/components/Ui/List/UiList'
import Subtask from '@/models/Subtask'
import SubtaskListItem from '@/components/Subtask/List/Item/SubtaskListItem'

interface Props {
  subtasks: Subtask[]
  activeSubtask: Subtask | null
  onClick?: (subtask: Subtask) => void
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


