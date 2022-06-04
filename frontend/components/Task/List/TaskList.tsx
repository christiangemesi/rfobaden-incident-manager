import React from 'react'
import Task from '@/models/Task'
import UiList from '@/components/Ui/List/UiList'
import TaskListItem from '@/components/Task/List/Item/TaskListItem'
import TaskForm from '@/components/Task/Form/TaskForm'
import UiCreateButton from '@/components/Ui/Button/UiCreateButton'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import Report from '@/models/Report'
import styled from 'styled-components'
import { useIncident } from '@/stores/IncidentStore'
import UiDrawer from '@/components/Ui/Drawer/UiDrawer'

interface Props {
  report: Report
  tasks: Task[]
  onSelect?: (task: Task) => void
}

const TaskList: React.VFC<Props> = ({ report, tasks, onSelect: handleSelect }) => {
  const incident = useIncident(report.incidentId)
  if(incident === null){
    throw new Error()
  }
  return (
    <Container>
      {!incident.isClosed && (
        <UiDrawer title="Auftrag erfassen" size="fixed">
          <UiDrawer.Trigger>{({ open }) => (
            <UiCreateButton onClick={open} title="Auftrag erfassen">
              <UiIcon.CreateAction size={1.5} />
            </UiCreateButton>
          )}</UiDrawer.Trigger>
          <UiDrawer.Body>{({ close }) => (
            <TaskForm report={report} onSave={handleSelect} onClose={close} />
          )}</UiDrawer.Body>
        </UiDrawer>
      )}
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