import React from 'react'
import Task from '@/models/Task'
import UiList from '@/components/Ui/List/UiList'
import TaskListItem from '@/components/Task/List/Item/TaskListItem'
import UiModal from '@/components/Ui/Modal/UiModal'
import UiTitle from '@/components/Ui/Title/UiTitle'
import TaskForm from '@/components/Task/Form/TaskForm'
import UiCreateButton from '@/components/Ui/Button/UiCreateButton'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import Report from '@/models/Report'
import styled from 'styled-components'

interface Props {
  report: Report
  tasks: Task[]
  onSelect?: (task: Task) => void
}

const TaskList: React.VFC<Props> = ({ report, tasks, onSelect: handleSelect }) => {
  return (
    <Container>
      <UiModal isFull>
        <UiModal.Activator>{({ open }) => (
          <UiCreateButton onClick={open} title="Auftrag erfassen">
            <UiIcon.CreateAction size={1.5} />
          </UiCreateButton>
        )}</UiModal.Activator>
        <UiModal.Body>{({ close }) => (
          <div>
            <UiTitle level={1} isCentered>
              Auftrag erfassen
            </UiTitle>
            <TaskForm report={report} onSave={handleSelect} onClose={close} />
          </div>
        )}</UiModal.Body>
      </UiModal>

      <UiList>
        {tasks.map((task) => (
          <TaskListItem key={task.id} task={task} onClick={handleSelect} />
        ))}
      </UiList>
    </Container>
  )
}
export default TaskList

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`