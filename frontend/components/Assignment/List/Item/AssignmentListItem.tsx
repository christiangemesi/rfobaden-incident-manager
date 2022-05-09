import Trackable from '@/models/Trackable'
import React, { Fragment, ReactNode } from 'react'
import UiTitle from '@/components/Ui/Title/UiTitle'
import styled, { css } from 'styled-components'
import IncidentStore from '@/stores/IncidentStore'
import UiListItemWithDetails from '@/components/Ui/List/Item/WithDetails/UiListItemWithDetails'
import UiLink from '@/components/Ui/Link/UiLink'
import TrackableSuffix from '@/components/Trackable/Suffix/TrackableSuffix'
import UiList from '@/components/Ui/List/UiList'


interface Props<T extends Trackable> {
  title: string
  records: T[]
  href: (record: T) => string
  children?: (record: T) => ReactNode
}

const AssignmentListItem = <T extends Trackable>({
  title,
  records,
  href,
  children,
}: Props<T>): JSX.Element => {
  if (records.length === 0) {
    return <React.Fragment />
  }

  return (
    <Fragment>
      <UiTitle level={3}>{title}</UiTitle>
      <EntityContainer>
        {records.map((e) => (
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
  )
}

export default AssignmentListItem

const EntityContainer = styled(UiList)`
  margin-bottom: 1rem;
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
