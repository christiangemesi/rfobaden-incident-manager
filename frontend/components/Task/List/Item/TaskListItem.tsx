import Task from '@/models/Task'
import React from 'react'
import { useUser } from '@/stores/UserStore'
import UiListItemWithDetails from '@/components/Ui/List/Item/WithDetails/UiListItemWithDetails'
import styled from 'styled-components'
import UiLink from '@/components/Ui/Link/UiLink'
import UiListItem from '@/components/Ui/List/Item/UiListItem'

interface Props {
  task: Task
  onClick?: (task: Task) => void
}

const TaskListItem: React.VFC<Props> = ({ task, onClick: handleClick }) => {
  const assignee = useUser(task.assigneeId)
  const assigneeName = assignee ? assignee.firstName + ' ' + assignee.lastName : ''

  return (
    <SpacerUiLink key={task.id} href={`/ereignisse/${task.incidentId}/meldungen/${task.reportId}/auftraege/${task.id}`}>
      <UiListItemWithDetails
        title={task.title}
        priority={task.priority}
        user={assigneeName}
        onClick={handleClick && (() => handleClick(task))}
      >
        <LeftSpacer>
          {/* TODO Show actual number of subtasks */}
          0/0
        </LeftSpacer>
      </UiListItemWithDetails>
    </SpacerUiLink>
  )
}
export default TaskListItem

const LeftSpacer = styled.div`
  margin-left: 1rem;
`

const SpacerUiLink = styled(UiLink)`
  //TODO not working not noticed in browser
  ${UiListItem} {
    margin: 0.5rem 0;
  }

  :first-child {
    ${UiListItem} {
      margin-top: 0;
    }
  }

  :last-child {
    ${UiListItem} {
      margin-bottom: 0;
    }
  }
}
`
