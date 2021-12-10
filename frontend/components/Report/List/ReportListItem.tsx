import Report from '@/models/Report'
import React, { useMemo } from 'react'
import { useUser } from '@/stores/UserStore'
import { useTasksOfReport } from '@/stores/TaskStore'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import styled, { css } from 'styled-components'
import UiListItemWithDetails from '@/components/Ui/List/Item/WithDetails/UiListItemWithDetails'
import { useUsername } from '@/models/User'

interface Props {
  report: Report
  isActive: boolean
  onClick?: (report: Report) => void
}

const ReportListItem: React.VFC<Props> = ({
  report,
  isActive,
  onClick: handleClick,
}) => {
  const assignee = useUser(report.assigneeId)

  const assigneeName = useUsername(assignee)

  const tasksAll = useTasksOfReport(report.id)

  const tasksDone = useMemo(() => (
    tasksAll.filter((task) => task.closedAt != null)
  ), [tasksAll])

  return (
    <SelectableListItem
      isActive={isActive}
      title={report.title}
      priority={report.priority}
      user={assigneeName ?? ''}
      onClick={handleClick && (() => handleClick(report))}
    >
      <StyledDiv>
        {report.isKeyReport ? (
          <UiIcon.KeyMessage />
        ) : (
          <UiIcon.Empty />
        )}
      </StyledDiv>
      <StyledDiv>
        {report.isLocationRelevantReport ? (
          <UiIcon.LocationRelevancy />
        ) : (
          <UiIcon.Empty />
        )}
      </StyledDiv>
      <StyledDiv>
        {tasksDone.length}/{tasksAll.length}
      </StyledDiv>
    </SelectableListItem>
  )
}
export default ReportListItem

// TODO Rename this component.
const StyledDiv = styled.div`
  margin-left: 1rem;
`

const SelectableListItem = styled(UiListItemWithDetails)<{ isActive: boolean }>`
  ${({ isActive, theme }) => isActive && css`
    background: ${theme.colors.secondary.contrast};
    color: ${theme.colors.secondary.value};
  `}
`
