import React, { ReactNode } from 'react'
import styled from 'styled-components'

interface Props {

  /**
   * Text to display.
   */
  text: string

  /**
   * The icon to display.
   */
  children: ReactNode
}

/**
 * `UiTextWithIcon` displays text next to an icon.
 */
const UiTextWithIcon: React.VFC<Props> = ({ children, text }) => {
  return (
    <StyledContainer>
      <StyledIcon>
        {children}
      </StyledIcon>
      <StyledText>
        {text}
      </StyledText>
    </StyledContainer>
  )
}

export default UiTextWithIcon

const StyledContainer = styled.div`
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
