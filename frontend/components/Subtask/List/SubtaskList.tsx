import React from 'react'
import UiList from '@/components/Ui/List/UiList'
import Subtask from '@/models/Subtask'
import SubtaskListItem from '@/components/Subtask/List/Item/SubtaskListItem'
import Incident from '@/models/Incident'
import Report from '@/models/Report'
import Task from '@/models/Task'
import UiModal from '@/components/Ui/Modal/UiModal'
import UiCreatButton from '@/components/Ui/Button/UiCreateButton'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiTitle from '@/components/Ui/Title/UiTitle'
import SubtaskForm from '@/components/Subtask/Form/SubtaskForm'

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
      <UiModal isFull>
        <UiModal.Activator>{({ open }) => (
          <UiCreatButton onClick={open}>
            <UiIcon.CreateAction size={1.4} />
          </UiCreatButton>
        )}</UiModal.Activator>
        <UiModal.Body>{({ close }) => (
          <div>
            <UiTitle level={1} isCentered>
              Teilauftrag erfassen
            </UiTitle>
            <SubtaskForm incident={incident} report={report} task={task} onClose={close} />
          </div>
        )}</UiModal.Body>
      </UiModal>

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


