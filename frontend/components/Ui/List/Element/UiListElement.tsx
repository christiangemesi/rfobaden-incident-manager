import React, { ReactNode } from 'react'
import styled from 'styled-components'
import Priority from '@/models/Priority'
import UiListItem from '@/components/Ui/List/Item/UiListItem'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UiIcon from '@/components/Ui/Icon/UiIcon'

interface Props {
  priority: Priority
  title: string,
  user: string,
  children: ReactNode,
}

const UiListElement: React.VFC<Props> = ({ priority, title, user, children }) => {
  let priorityIcon = <UiIcon.PriorityMedium />

  if (priority === Priority.HIGH) {
    priorityIcon = <UiIcon.PriorityHigh />
  } else if (priority === Priority.LOW) {
    priorityIcon = <UiIcon.PriorityLow />
  }

  return (
    <UiListItem>
      <StyledDiv>
        <StyledPriority>
          {priorityIcon}
        </StyledPriority>
        <StyledBelowEachOther>
          <UiTitle level={5}>
            {title}
          </UiTitle>
          {user}
        </StyledBelowEachOther>
      </StyledDiv>
      <StyledChildren>
        {children}
      </StyledChildren>
    </UiListItem>
  )
}
export default UiListElement

const StyledBelowEachOther = styled.div`
  width: max-content;
`
const StyledPriority = styled.div`
  display: inline-flex;
  margin-right: 0.5rem;
`
const StyledChildren = styled.div`
  display: flex;
  align-items: center;
`
const StyledDiv = styled.div`
  display: flex;
  align-items: center;
`