import Task from '@/models/Task'
import React, { useState } from 'react'
import styled from 'styled-components'
import BackendService from '@/services/BackendService'
import ReportStore from '@/stores/ReportStore'
import UiList from '@/components/Ui/List/UiList'
import Priority from '@/models/Priority'
import UiCheckbox from '@/components/Ui/Checkbox/UiCheckbox'
import UiItemWithDetails from '@/components/Ui/List/Element/UiItemWithDetails'
import { useUser } from '@/stores/UserStore'

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

//TODO change to Subtask
const SubtaskListItem: React.VFC<TaskListItemProps> = ({ subtask, isActive, onClick: handleClick }) => {

  const assignee = useUser(subtask.assigneeId)
  const assigneeName = assignee?.firstName + ' ' + assignee?.lastName ?? ''
  //TODO
  const [value, setValue] = useState(false)

  const handleDelete = async () => {
    if (confirm(`Sind sie sicher, dass sie den Auftrag "${subtask.title}" schliessen wollen?`)) {
      await BackendService.delete(`incidents/${subtask.incidentId}/reports/${subtask.reportId}/tasks`, subtask.id)
      ReportStore.remove(subtask.id)
    }
  }

  return (

    <UiItemWithDetails priority={Priority.LOW} title={subtask.title} user={assigneeName}>
      <UiCheckbox label="" value={value} onChange={setValue} color="tertiary" />
    </UiItemWithDetails>
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