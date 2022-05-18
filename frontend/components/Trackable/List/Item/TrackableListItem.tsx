import React, { ReactNode } from 'react'
import { useUser } from '@/stores/UserStore'
import styled, { css } from 'styled-components'
import UiListItemWithDetails from '@/components/Ui/List/Item/WithDetails/UiListItemWithDetails'
import { useUsername } from '@/models/User'
import { Themed } from '@/theme'
import Trackable from '@/models/Trackable'
import TrackableSuffix from '@/components/Trackable/Suffix/TrackableSuffix'

export interface Props<T> {
  record: T
  isActive: boolean
  isSmall: boolean
  isClosed: boolean
  onClick?: (record: T) => void
  children?: ReactNode
}

const TrackableListItem = <T extends Trackable>({
  record,
  isActive,
  isSmall,
  isClosed,
  children,
  onClick: handleClick,
}: Props<T>): JSX.Element => {
  const assignee = useUser(record.assigneeId)
  const assigneeName = useUsername(assignee)

  return (
    <Item
      isActive={isActive}
      isClosed={isClosed}
      isSmall={isSmall}
      title={record.title}
      description={isSmall ? undefined : record.description ?? undefined}
      priority={record.priority}
      user={assigneeName ?? ''}
      onClick={handleClick && (() => handleClick(record))}
    >
      <TrackableSuffix trackable={record} isSmall={isSmall}>
        {children}
      </TrackableSuffix>

      <BridgeClip>
        <Bridge isActive={isActive ?? false} />
      </BridgeClip>
    </Item>
  )
}
export default TrackableListItem



const Bridge = styled.div<{ isActive: boolean }>`
  width: 100%;
  height: 100%;

  background-color: ${({ theme }) => theme.colors.secondary.value};

  transition: 300ms ease-in-out;
  transition-property: transform, background-color, box-shadow;
  transform-origin: left center;
  transform: scaleX(0);
  will-change: transform, background-color, box-shadow;
  border-top: 1px solid ${({ theme }) => theme.colors.grey.value};
  border-bottom: 1px solid ${({ theme }) => theme.colors.grey.value};
  

  ${({ isActive, theme }) => isActive && css`
    transform: scaleX(1);
    transform-origin: right center;

    background-color: ${theme.colors.light.value};
  `}
`

const BridgeClip = styled.div`
  position: absolute;
  left: 100%;
  width: calc(2rem + 2px);
  height: calc(100% + 2px);
  z-index: 3;

  ${Themed.media.md.max} {
    display: none;
  }
`
const Item = styled(UiListItemWithDetails)<{ isActive: boolean }>`
  ${({ isActive }) => isActive && css`
    transition-duration: 300ms;
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
  `}
  :hover ${Bridge} {
    background-color: ${({ theme }) => theme.colors.hover.value};
  }
`
