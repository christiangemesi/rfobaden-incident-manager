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
      description={record.description ?? undefined}
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

const Item = styled(UiListItemWithDetails)<{ isActive: boolean }>`
  ${({ isActive }) => isActive && css`
    transition-duration: 300ms;
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
  `}
`

const Bridge = styled.div<{ isActive: boolean }>`
  width: 100%;
  height: 100%;

  background-color: ${({ theme }) => theme.colors.secondary.value};

  transition: 300ms ease-in-out;
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

  ${Themed.media.md.max} {
    display: none;
  }
`
