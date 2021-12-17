import React from 'react'
import UiList from '@/components/Ui/List/UiList'
import Subtask from '@/models/Subtask'
import SubtaskListItem from '@/components/Subtask/List/Item/SubtaskListItem'
import ReportListItem from '@/components/Report/List/Item/ReportListItem'

interface Props {
  subtasks: Subtask[]
  activeSubtask: Subtask | null
  onClick?: (subtask: Subtask) => void
}

const SubtaskList: React.VFC<Props> = ({ subtasks, activeSubtask, onClick: handleClick }) => {
  return (
    <UiList>
      {subtasks.map((subtask) => (
        <SubtaskListItem
          key={subtask.id}
          subtask={subtask}
          onClick={handleClick}
          isActive={activeSubtask !== null && activeSubtask.id == subtask.id}
        />
      ))}
    </UiList>
  )
}
export default SubtaskList


