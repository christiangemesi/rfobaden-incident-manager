import Trackable from '@/models/Trackable'
import React, { Fragment, ReactNode } from 'react'
import UiTitle from '@/components/Ui/Title/UiTitle'
import styled from 'styled-components'


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
              children(e)
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
