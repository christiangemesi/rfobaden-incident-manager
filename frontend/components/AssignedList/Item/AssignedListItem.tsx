import Trackable from '@/models/Trackable'
import React, { Fragment } from 'react'
import UiTitle from '@/components/Ui/Title/UiTitle'
import styled from 'styled-components'

interface Props {
  title: string
  trackable: Trackable[]
}

const AssignedListItem: React.VFC<Props> = ({
  title,
  trackable,
}) => {
  return (
    <Fragment>
      {trackable.length > 0 && (
        <EntityContainer>
          <UiTitle level={4}>{title}</UiTitle>
          {trackable.map((e) => (
            <div key={e.id}>
              {e.assigneeId}
              {e.startsAt?.toTimeString()??''}
              {e.endsAt?.toTimeString()??''}
              {e.title}
              {e.priority}
            </div>
          ))}
        </EntityContainer>
      )}
    </Fragment>
  )
}


export default AssignedListItem

const EntityContainer = styled.div`
  margin: 1rem 0;
`