import React, { useMemo } from 'react'
import UiList from '@/components/Ui/List/UiList'
import Subtask from '@/models/Subtask'
import SubtaskListItem from '@/components/Subtask/List/Item/SubtaskListItem'
import Incident from '@/models/Incident'
import Report from '@/models/Report'
import Task from '@/models/Task'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import { useSubtasks } from '@/stores/SubtaskStore'

interface Props {
  subtasks: Subtask[]
  onClick?: (subtask: Subtask) => void
}

const SubtaskList: React.VFC<Props> = ({
  subtasks,
  onClick: handleClick,
}) => {
  const [openSubtasks, closedSubtasks] = useMemo(() => (
    subtasks.reduce(([open, closed], subtask) => {
      if (subtask.isClosed) {
        closed.push(subtask)
      } else {
        open.push(subtask)
      }
      return [open, closed]
    }, [[] as Subtask[], [] as Subtask[]])

  ), [subtasks])

  return (
    <UiGrid gap={2} style={{ flexWrap: 'nowrap' }}>
      <UiGrid.Col size={{ xs: 12, md: 6 }}>
        {openSubtasks.map((subtask) => (
          <SubtaskListItem
            key={subtask.id}
            subtask={subtask}
            onClick={handleClick}
          />
        ))}
      </UiGrid.Col>
      <UiGrid.Col size={{ xs: 12, md: 6 }}>
        <UiList>
          {closedSubtasks.map((subtask) => (
            <SubtaskListItem
              key={subtask.id}
              subtask={subtask}
              onClick={handleClick}
            />
          ))}
        </UiList>
      </UiGrid.Col>
    </UiGrid>
  )
}
export default SubtaskList


