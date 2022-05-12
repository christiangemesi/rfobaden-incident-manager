import Subtask, { parseSubtask } from '@/models/Subtask'
import React, { useCallback, useEffect, useState } from 'react'
import { useUser } from '@/stores/UserStore'
import UiListItemWithDetails from '@/components/Ui/List/Item/WithDetails/UiListItemWithDetails'
import { useUsername } from '@/models/User'
import ReactDOM from 'react-dom'
import { DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd'
import styled, { css } from 'styled-components'
import UiCheckbox from '@/components/Ui/Checkbox/UiCheckbox'
import SubtaskStore from '@/stores/SubtaskStore'
import BackendService from '@/services/BackendService'
import SubtaskActions from '@/components/Subtask/Actions/SubtaskActions'
import Task from '@/models/Task'
import UiDescription from '@/components/Ui/Description/UiDescription'
import { useIncident } from '@/stores/IncidentStore'

interface Props {
  task: Task
  subtask: Subtask,
  provided?: DraggableProvided
  snapshot?: DraggableStateSnapshot
  onClick?: (Subtask: Subtask) => void,
}

const SubtaskListItem: React.VFC<Props> = ({
  task,
  subtask,
  provided = null,
  snapshot = null,
  onClick: handleClick,
}) => {
  const incident = useIncident(task.incidentId)
  if(incident === null) {
    throw new Error('incident not found')
  }

  const assignee = useUser(subtask.assigneeId)
  const assigneeName = useUsername(assignee)

  const handleChange = useCallback(async () => {
    const isClosed = !subtask.isClosed
    SubtaskStore.save({ ...subtask, isClosed })
    const [newSubtask, error] = await BackendService.update<Subtask>(`incidents/${subtask.incidentId}/reports/${subtask.reportId}/tasks/${subtask.taskId}/subtasks`, subtask.id, {
      ...subtask,
      isClosed,
    })
    if (error !== null) {
      throw error
    }
    SubtaskStore.save(parseSubtask(newSubtask))
  }, [subtask])

  // Delay updates to `isDragging` with a timeout, so the css transitions have time to finish.
  const [isDragging, setDragging] = useState(false)
  useEffect(() => {
    const isSnapshotDragging = snapshot?.isDragging ?? null
    if (isSnapshotDragging !== null) {
      setTimeout(() => {
        setDragging(isSnapshotDragging)
      })
    }
  }, [snapshot?.isDragging])

  const child = (
    <div
      ref={provided?.innerRef}
      {...provided?.draggableProps ?? {}}
      {...provided?.dragHandleProps ?? {}}
    >
      <Item
        priority={subtask.priority}
        title={subtask.title}
        user={assigneeName ?? ''}
        isDragging={isDragging && snapshot !== null && !snapshot.isDropAnimating}
        onClick={handleClick && (() => handleClick(subtask))}
        body={subtask.description && (
          <UiDescription description={subtask.description} />
        )}
      >
        <SubtaskActions task={task} subtask={subtask} />
        <UiCheckbox label="" value={subtask.isClosed} onChange={handleChange} isDisabled={incident.isClosed} />
      </Item>
    </div>
  )

  return snapshot !== null && snapshot.isDragging
    ? ReactDOM.createPortal(child, document.body)
    : child
}

export default SubtaskListItem

const Item = styled(UiListItemWithDetails)<{ isDragging: boolean }>`
  margin-bottom: 0.5rem;
  
  transition: 150ms ease-out;
  transition-property: transform;
  
  ${({ isDragging }) => isDragging && css`
      transform: rotate(3deg);
  `}
`