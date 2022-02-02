import Task from '@/models/Task'
import React from 'react'
import { useUser } from '@/stores/UserStore'
import UiListItemWithDetails from '@/components/Ui/List/Item/WithDetails/UiListItemWithDetails'
import styled from 'styled-components'
import UiLink from '@/components/Ui/Link/UiLink'

interface Props {
  task: Task
  onClick?: (task: Task) => void
}

const TaskListItem: React.VFC<Props> = ({ task, onClick: handleClick }) => {
  const assignee = useUser(task.assigneeId)
  const assigneeName = assignee ? assignee.firstName + ' ' + assignee.lastName : ''

  return (
    <UiLink key={task.id} href={`/ereignisse/${task.incidentId}/meldungen/${task.reportId}/auftraege/${task.id}`}>
      <UiListItemWithDetails
        title={task.title}
        priority={task.priority}
        user={assigneeName}
        onClick={handleClick && (() => handleClick(task))}
      >
        <LeftSpacer>
          {task.closedSubtaskIds.length}/{task.subtaskIds.length}
        </LeftSpacer>
      </UiListItemWithDetails>
    </UiLink>
  )
}
export default TaskListItem

const LeftSpacer = styled.div`
  margin-left: 1rem;
`

