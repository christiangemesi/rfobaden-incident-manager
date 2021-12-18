import Subtask, { parseSubtask } from '@/models/Subtask'
import React, { useState } from 'react'
import { useUser } from '@/stores/UserStore'
import UiListItemWithDetails from '@/components/Ui/List/Item/WithDetails/UiListItemWithDetails'
import UiCheckbox from '@/components/Ui/Checkbox/UiCheckbox'
import styled, { css } from 'styled-components'
import { useUsername } from '@/models/User'
import BackendService from '@/services/BackendService'
import Incident from '@/models/Incident'
import Report from '@/models/Report'
import Task from '@/models/Task'
import SubtaskStore from '@/stores/SubtaskStore'

interface Props {
  incident: Incident
  report: Report
  task: Task
  subtask: Subtask,
  isActive: boolean,
  onClick?: (Subtask: Subtask) => void,
}

const SubtaskListItem: React.VFC<Props> = ({
  incident,
  report,
  task,
  subtask,
  isActive,
  onClick: handleClick }) => {

  const assignee = useUser(subtask.assigneeId)
  const assigneeName = useUsername(assignee)

  const [isClosed, setClosed] = useState(subtask.isClosed)

  const handleChange = async () => {
    const [newSubtask, error] = await BackendService.update<Subtask>(`incidents/${incident.id}/reports/${report.id}/tasks/${task.id}/subtasks`, subtask.id, {
      ...subtask,
      isClosed: !subtask.isClosed,
    })
    if (error !== null) {
      throw error
    }
    SubtaskStore.save(parseSubtask(newSubtask))
    setClosed(newSubtask.isClosed)
  }

  return (
    <SelectableListItem
      isActive={isActive}
      priority={subtask.priority}
      title={subtask.title}
      user={assigneeName ?? ''}
      onClick={handleClick && (() => handleClick(subtask))}>
      <UiCheckbox label="" value={isClosed} onChange={handleChange} color="tertiary" />
    </SelectableListItem>
  )
}

export default SubtaskListItem

const SelectableListItem = styled(UiListItemWithDetails)<{ isActive: boolean }>`
  ${({ isActive, theme }) => isActive && css`
    background: ${theme.colors.secondary.contrast};
    color: ${theme.colors.secondary.value};
  `}
`
