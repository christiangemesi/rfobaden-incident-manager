import Task from '@/models/Task'
import React from 'react'
import styled from 'styled-components'
import BackendService from '@/services/BackendService'
import ReportStore from '@/stores/ReportStore'

interface Props{
  tasks: Task[]
  onEdit?: (task: Task) => void
}

const TaskList: React.VFC<Props> = ({ tasks , onEdit: handleEdit }) => {
  return (
    <StyledTable>
      <thead>
        <StyledTr>
          <StyledTh>
            Task
          </StyledTh>
          <StyledTh>
            Priorität
          </StyledTh>
          <StyledTh>
            Ort
          </StyledTh>
          <StyledTh>
            Zuweisung
          </StyledTh>
        </StyledTr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <TaskListItem key={task.id} task={task} onEdit={handleEdit} />
        ))}
      </tbody>
    </StyledTable>
  )
}
export default TaskList

interface TaskListItemProps {
  task: Task
  onEdit?: (Task: Task) => void
}

const TaskListItem: React.VFC<TaskListItemProps> = ({ task, onEdit: handleEdit }) => {

  const  handleDelete = async () => {
    if (confirm(`Sind sie sicher, dass sie den Auftrag "${task.title}" schliessen wollen?`)){
      await BackendService.delete(`incidents/${task.incidentId}/reports/${task.reportId}/tasks`, task.id)
      ReportStore.remove(task.id)
    }
  }

  return (
    <StyledTr>
      <StyledTd>
        {task.title}
      </StyledTd>
      <StyledTd>
        {task.priority}
      </StyledTd><StyledTd>
        {task.location}
      </StyledTd>

      <StyledTdSmall>
        <StyledButton type="button" onClick={handleEdit && (() => handleEdit(task))}>
          Bearbeiten
        </StyledButton>
      </StyledTdSmall>
      <StyledTdSmall>
        <StyledButton type="button" onClick={handleDelete}>
          Löschen
        </StyledButton>
      </StyledTdSmall>
    </StyledTr>
  )
}


const StyledTable = styled.table`
  display: block;
  width: 100%;
  border: 1px solid lightgray;
  border-radius: 0.25rem;
  margin-top: 2rem;
  `
const StyledTr = styled.tr`
width: 100%;

:nth-child(2n) {
    background-color: lightgray;
  }
`
const StyledTh = styled.th`
  padding: 0.5rem;
  vertical-align: middle;
  font-weight: bold;
  text-align: left;
  `
const StyledTd = styled.td`
  width: 10%;
  padding: 0.5rem;
  vertical-align: middle;
  `
const StyledTdSmall = styled(StyledTd)`
  width: 40px;
`
const StyledButton = styled.button`
  display: block;
  width: 100%;
  `