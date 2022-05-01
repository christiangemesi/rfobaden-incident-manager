import Trackable from '@/models/Trackable'
import React, { Fragment, ReactNode } from 'react'
import UiTitle from '@/components/Ui/Title/UiTitle'
import styled, { css } from 'styled-components'
import IncidentStore from '@/stores/IncidentStore'
import UiListItemWithDetails from '@/components/Ui/List/Item/WithDetails/UiListItemWithDetails'
import UiLink from '@/components/Ui/Link/UiLink'
import TrackableSuffix from '@/components/Trackable/Suffix/TrackableSuffix'


interface Props<T extends Trackable> {
  title: string
  trackable: T[]
  href: (record: T) => string
  children?: (record: T) => ReactNode
}

const AssignmentListItem = <T extends Trackable>({
  title,
  trackable,
  href,
  children,
}: Props<T>): JSX.Element => {
  return (
    <Fragment>
      {trackable.length > 0 && (
        <Fragment>
          <UiTitle level={3}>{title}</UiTitle>
          <EntityContainer>
            {trackable.map((e) => (
              <UiLink
                href={href(e)}
                key={e.id}
              >
                <Item
                  isActive={false}
                  isClosed={e.isClosed}
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
        </Fragment>
      )}
    </Fragment>
  )
}

export default AssignmentListItem

const EntityContainer = styled.div`
  margin: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`
const Item = styled(UiListItemWithDetails)<{ isActive: boolean }>`
  ${({ isActive }) => isActive && css`
    transition-duration: 300ms;
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
  `}
}
`
