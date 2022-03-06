import Subtask, { parseSubtask } from '@/models/Subtask'
import React, { useCallback, useState } from 'react'
import { useUser } from '@/stores/UserStore'
import UiListItemWithDetails from '@/components/Ui/List/Item/WithDetails/UiListItemWithDetails'
import UiCheckbox from '@/components/Ui/Checkbox/UiCheckbox'
import { useUsername } from '@/models/User'
import BackendService from '@/services/BackendService'
import Incident from '@/models/Incident'
import Report from '@/models/Report'
import Task from '@/models/Task'
import SubtaskStore from '@/stores/SubtaskStore'

interface Props {
  subtask: Subtask,
  onClick?: (Subtask: Subtask) => void,
}

const SubtaskListItem: React.VFC<Props> = ({
  subtask,
  onClick: handleClick }) => {

  const assignee = useUser(subtask.assigneeId)
  const assigneeName = useUsername(assignee)

  const [isClosed, setClosed] = useState(subtask.isClosed)

  const handleChange = useCallback(async () => {
    const [newSubtask, error] = await BackendService.update<Subtask>(`incidents/${subtask.incidentId}/reports/${subtask.reportId}/tasks/${subtask.taskId}/subtasks`, subtask.id, {
      ...subtask,
      isClosed: !subtask.isClosed,
    })
    if (error !== null) {
      throw error
    }
    SubtaskStore.save(parseSubtask(newSubtask))
    setClosed(newSubtask.isClosed)
  }, [subtask])

  return (
    <UiListItemWithDetails
      isClosed={subtask.isClosed}
      priority={subtask.priority}
      title={subtask.title}
      user={assigneeName ?? ''}
      onClick={handleClick && (() => handleClick(subtask))}>
      <UiCheckbox label="" value={isClosed} onChange={handleChange} />
    </UiListItemWithDetails>
  )
}

export default SubtaskListItem
