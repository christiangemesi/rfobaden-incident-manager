import Report from '@/models/Report'
import React from 'react'
import { useUser } from '@/stores/UserStore'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import styled from 'styled-components'
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

  return (
    <UiListItemWithDetails
      isActive={isActive}
      isClosed={report.isClosed || report.isDone}
      title={report.title}
      priority={report.priority}
      user={assigneeName ?? ''}
      onClick={handleClick && (() => handleClick(report))}
    >
      <LeftSpacer>
        {report.isKeyReport ? (
          <UiIcon.KeyMessage />
        ) : (
          <UiIcon.Empty />
        )}
      </LeftSpacer>
      <LeftSpacer>
        {report.isLocationRelevantReport ? (
          <UiIcon.LocationRelevancy />
        ) : (
          <UiIcon.Empty />
        )}
      </LeftSpacer>
      <LeftSpacer>
        {report.closedTaskIds.length}/{report.taskIds.length}
      </LeftSpacer>
    </UiListItemWithDetails>
  )
}
export default ReportListItem

const LeftSpacer = styled.div`
  margin-left: 1rem;
`
