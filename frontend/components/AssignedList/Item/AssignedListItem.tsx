import Trackable from '@/models/Trackable'
import React, { Fragment, ReactNode } from 'react'
import UiTitle from '@/components/Ui/Title/UiTitle'
import styled, { css } from 'styled-components'
import UiDateLabel from '@/components/Ui/DateLabel/UiDateLabel'
import IncidentStore from '@/stores/IncidentStore'
import UiListItemWithDetails from '@/components/Ui/List/Item/WithDetails/UiListItemWithDetails'
import { Themed } from '@/theme'


interface Props<T extends Trackable> {
  title: string
  trackable: T[]
  children: (record: T) => ReactNode
}

const AssignedListItem = <T extends Trackable>({
  title,
  trackable,
  children,
}: Props<T>): JSX.Element => {
  return (
    <Fragment>
      {trackable.length > 0 && (
        <Fragment>
          <UiTitle level={3}>{title}</UiTitle>
          <EntityContainer>
            {trackable.map((e) => (
              <Item
                key={e.id}
                isActive={false}
                isClosed={e.isClosed}
                title={e.title}
                priority={e.priority}
                user={IncidentStore.find(e.incidentId)?.title ?? ''}
                titleSwitched={true}
              >
                <SuffixList>
                  <SuffixDate hasEnd={e.endsAt != null}>
                    <UiDateLabel start={e.startsAt ?? e.createdAt} end={e.endsAt} />
                  </SuffixDate>
                  {children(e)}
                </SuffixList>
              </Item>
            ))}
          </EntityContainer>
        </Fragment>
      )}
    </Fragment>
  )
}

export default AssignedListItem

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
const SuffixList = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  column-gap: 1.5rem;
  white-space: nowrap;

  transition: 150ms ease-out;
  transition-property: column-gap;
`
const SuffixDate = styled.div<{ hasEnd: boolean }>`
  ${Themed.media.sm.max} {
    display: none;
  }

  > span {
    ${Themed.media.md.max} {
      ${({ hasEnd }) => hasEnd && css`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;
      `}
    }
  }
`
