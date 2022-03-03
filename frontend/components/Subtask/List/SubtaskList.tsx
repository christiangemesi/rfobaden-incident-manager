import React from 'react'
import UiList from '@/components/Ui/List/UiList'
import Subtask from '@/models/Subtask'
import SubtaskListItem from '@/components/Subtask/List/Item/SubtaskListItem'
import Incident from '@/models/Incident'
import Report from '@/models/Report'
import Task from '@/models/Task'

interface Props {
  incident: Incident
  report: Report
  task: Task
  subtasks: Subtask[]
  activeSubtask: Subtask | null
  onClick?: (subtask: Subtask) => void
}

const SubtaskList: React.VFC<Props> = ({
  incident,
  report,
  task,
  subtasks,
  activeSubtask,
  onClick: handleClick }) => {
  return (
    <UiList>
      {subtasks.map((subtask) => (
        <SubtaskListItem
          incident={incident}
          report={report}
          task={task}
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


