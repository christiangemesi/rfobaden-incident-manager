import Report from '@/models/Report'
import React from 'react'
import { useUser } from '@/stores/UserStore'
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

  return (
    <Li
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

      <BridgeClip>
        <Bridge isActive={isActive ?? false} />
      </BridgeClip>
    </Li>
  )
}
export default ReportListItem

const Li = styled(UiListItemWithDetails)<{ isActive: boolean }>`
  ${({ isActive }) => isActive && css`
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;;
  `}
`

const LeftSpacer = styled.div`
  margin-left: 1rem;
`

const Bridge = styled.div<{ isActive: boolean }>`
  width: 100%;
  height: 100%;
  
  background-color: ${({ theme }) => theme.colors.tertiary.value};
  box-shadow: 0 0 4px 2px gray;
  
  ${({ isActive }) => !isActive && css`
    background-color: transparent;
    box-shadow: none;
  `}
`

const BridgeClip = styled.div`
  position: absolute;
  left: calc(100% - 1px);
  width: calc(2rem + 3px);
  height: calc(100%);
  z-index: 5;
  
  overflow-x: clip;
  overflow-y: visible;
`
