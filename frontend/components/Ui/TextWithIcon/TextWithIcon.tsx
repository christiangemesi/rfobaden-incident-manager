import React, { ReactNode } from 'react'
import styled from 'styled-components'

interface Props {
  text: string
  children: ReactNode
}

const TextWithIcon: React.VFC<Props> = ({ children,text  }) => {
  return (
    <StyledTitle>
      <StyledIcon>
        {children}
      </StyledIcon>
      <StyledText>
        {text}
      </StyledText>
    </StyledTitle>
  )
}

export default TextWithIcon

const StyledTitle = styled.div`
  display: inline-flex;
  align-items: center;
`

const StyledIcon = styled.span`
  margin-right: 2px;
`
const StyledText = styled.span`
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.1px;
`

