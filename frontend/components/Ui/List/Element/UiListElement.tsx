import React, { ReactNode } from 'react'
import styled from 'styled-components'
import Priority from '@/models/Priority'
import UiListItem from '@/components/Ui/List/Item/UiListItem'
import UiTitle from '@/components/Ui/Title/UiTitle'

interface Props {
  priority: Priority
  title: string,
  user: string,
  children: ReactNode,
}

const UiListElement: React.VFC<Props> = ({ priority, title, user, children }) => {
  return (
    <UiListItem>
      <StyledDiv>
        <StyledPriority>
          {priority}
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

  > * {
    margin-left: 0.5rem;
  }
`
const StyledDiv = styled.div`
  display: flex;
  align-items: center;
`