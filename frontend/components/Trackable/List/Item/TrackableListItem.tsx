import React, { ReactNode } from 'react'
import { useUser } from '@/stores/UserStore'
import styled, { css } from 'styled-components'
import UiListItemWithDetails from '@/components/Ui/List/Item/WithDetails/UiListItemWithDetails'
import { useUsername } from '@/models/User'
import { Themed } from '@/theme'
import Trackable from '@/models/Trackable'
import TrackableSuffix from '@/components/Trackable/Suffix/TrackableSuffix'

export interface Props<T> {
  /**
   * The record to display.
   */
  record: T

  /**
   * Whether the item is currently selected.
   */
  isActive: boolean

  /**
   * Whether the item should make its contents slightly smaller.
   */
  isSmall: boolean

  /**
   * Whether the record is closed.
   */
  isClosed: boolean

  /**
   * Event caused by clicking on the item.
   */
  onClick?: (record: T) => void

  /**
   * Additional content to display.
   */
  children?: ReactNode
}

/**
 * `TrackableListItem` is a component that displays a {@link Trackable trackable entity} in a list.
 */
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

  transition: 150ms ease-out;
  transition-property: transform, background-color, box-shadow;
  transform-origin: left center;
  transform: scaleX(0);
  will-change: transform, background-color, box-shadow;
  border-top: 1px solid ${({ theme }) => theme.colors.grey.value};
  border-bottom: 1px solid ${({ theme }) => theme.colors.grey.value};
  
  ${({ isActive, theme }) => isActive && css`
    transition-duration: 300ms;
    transform: scaleX(1);
    transform-origin: right center;
    background-color: ${theme.colors.light.value};
  `}
`
const BridgeClip = styled.div`
  position: absolute;
  top: -1px;
  left: 100%;
  width: calc(2rem + 2px);
  height: 3.5rem;
  z-index: 3;

  ${Themed.media.md.max} {
    display: none;
  }
`
const Item = styled(UiListItemWithDetails)<{ isActive: boolean }>`
  height: 3.5rem;
  position: relative;
  ${({ isActive }) => isActive && css`
    transition-duration: 300ms;
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
  `}
  :hover ${Bridge} {
    background-color: ${({ theme }) => theme.colors.secondary.hover};
  }
`
