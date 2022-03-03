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
      <div>
        {report.isKeyReport ? (
          <UiIcon.KeyMessage />
        ) : (
          <UiIcon.Empty />
        )}
      </div>
      <div>
        {report.isLocationRelevantReport ? (
          <UiIcon.LocationRelevancy />
        ) : (
          <UiIcon.Empty />
        )}
      </div>
      <div>
        {report.closedTaskIds.length}/{report.taskIds.length}
      </div>

      <BridgeClip>
        <Bridge isActive={isActive ?? false} />
      </BridgeClip>
    </Li>
  )
}
export default ReportListItem

const Li = styled(UiListItemWithDetails)<{ isActive: boolean }>`
  display: flex;
  row-gap: 1rem;
  transition-timing-function: cubic-bezier(1, 0.23, 1, 0.32);
  ${({ isActive }) => isActive && css`
    transition-duration: 300ms;
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;;
  `}
`

const Bridge = styled.div<{ isActive: boolean }>`
  width: 100%;
  height: 100%;
  
  background-color: ${({ theme }) => theme.colors.secondary.value};

  transition: 750ms cubic-bezier(0.23, 1, 0.32, 1);
  transition-property: transform, background-color, box-shadow;
  transform-origin: left center;
  transform: scaleX(0);
  will-change: transform, background-color, box-shadow;
  
  ${({ isActive, theme }) => isActive && css`
    transform: scaleX(1);
    transform-origin: right center;
    
    background-color: ${theme.colors.tertiary.value};
    box-shadow: 0 0 4px 2px gray;
  `}
`

const BridgeClip = styled.div`
  position: absolute;
  left: calc(100% - 1px);
  width: calc(2rem + 1px);
  height: calc(100%);
  z-index: 3;
  
  overflow-x: clip;
  overflow-y: visible;
`
