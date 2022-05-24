import Trackable from '@/models/Trackable'
import React, { ReactNode } from 'react'
import UiTitle from '@/components/Ui/Title/UiTitle'
import styled, { css } from 'styled-components'
import IncidentStore from '@/stores/IncidentStore'
import UiListItemWithDetails from '@/components/Ui/List/Item/WithDetails/UiListItemWithDetails'
import UiLink from '@/components/Ui/Link/UiLink'
import TrackableSuffix from '@/components/Trackable/Suffix/TrackableSuffix'
import UiList from '@/components/Ui/List/UiList'


interface Props<T extends Trackable> {
  /**
   * Title of the list item.
   */
  title: string

  /**
   * List of assigned {@link Trackable entities}.
   */
  records: T[]

  /**
   * Map an entity to its frontend path.
   */
  href: (record: T) => string

  /**
   * Map an entity to its done value.
   */
  isDone?: (record: T) => boolean

  /**
   * Additional item content.
   */
  children?: (record: T) => ReactNode
}

/**
 * `AssignmentListItem` is a component that displays an assigned {@link Trackable trackable entity} linked to its source.
 */
const AssignmentListItem = <T extends Trackable>({
  title,
  records,
  href,
  isDone = () => false,
  children,
}: Props<T>): JSX.Element => {
  if (records.length === 0) {
    return <React.Fragment />
  }

  return (
    <React.Fragment>
      <UiTitle level={3}>{title}</UiTitle>
      <EntityContainer>
        {records.map((e) => (
          <UiLink
            href={href(e)}
            key={e.id}
          >
            <Item
              isActive={false}
              isClosed={e.isClosed || isDone(e)}
              title={e.title}
              priority={e.priority}
              user={IncidentStore.find(e.incidentId)?.title ?? ''}
              isTitleSwitched
            >
              <TrackableSuffix trackable={e} isSmall={false}>
                {children && children(e)}
              </TrackableSuffix>
            </Item>
          </UiLink>
        ))}
      </EntityContainer>
    </React.Fragment>
  )
}
export default AssignmentListItem

const EntityContainer = styled(UiList)`
  margin-bottom: 1rem;
`

const Item = styled(UiListItemWithDetails)<{ isActive: boolean }>`
  ${({ isActive }) => isActive && css`
    transition-duration: 300ms;
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
  `}
}
`
