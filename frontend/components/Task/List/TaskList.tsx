import React from 'react'
import Task from '@/models/Task'
import UiList from '@/components/Ui/List/UiList'
import TaskListItem from '@/components/Task/List/Item/TaskListItem'
import UiModal from '@/components/Ui/Modal/UiModal'
import UiCreatButton from '@/components/Ui/Button/UiCreateButton'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiTitle from '@/components/Ui/Title/UiTitle'
import TaskForm from '@/components/Task/Form/TaskForm'
import Incident from '@/models/Incident'
import Report from '@/models/Report'

interface Props {
  incident: Incident
  report: Report
  tasks: Task[]
  onClick?: (task: Task) => void
}

const TaskList: React.VFC<Props> = ({ incident, report, tasks, onClick: handleClick }) => {
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
              Auftrag erfassen
            </UiTitle>
            <TaskForm incident={incident} report={report} onClose={close} />
          </div>
        )}</UiModal.Body>
      </UiModal>
      {tasks.map((task) => (
        <TaskListItem key={task.id} task={task} onClick={handleClick} />
      ))}
    </UiList>
  )

}
export default TaskList
