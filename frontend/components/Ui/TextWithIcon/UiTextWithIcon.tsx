import React, { ReactNode } from 'react'
import styled from 'styled-components'

interface Props {
  text: string
  children: ReactNode
}

const UiTextWithIcon: React.VFC<Props> = ({ children, text }) => {
  return (
    <StyledDiv>
      <StyledIcon>
        {children}
      </StyledIcon>
      <StyledText>
        {text}
      </StyledText>
    </StyledDiv>
  )
}

export default UiTextWithIcon

const StyledDiv = styled.div`
  display: inline-flex;
  align-items: center;
`
const StyledIcon = styled.span`
  margin-right: 2px;
  height: 100%;
  margin-top: 0;
  margin-bottom: auto;
`
const StyledText = styled.span`
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.1px;
`