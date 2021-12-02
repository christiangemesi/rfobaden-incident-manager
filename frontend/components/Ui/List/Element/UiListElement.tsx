import React, { ReactNode } from 'react'
import styled from 'styled-components'

interface Props {
  title: string,
  children: ReactNode
}

const UiListElement: React.VFC<Props> = ({ title }) => {
  return (
    <StyledTitle title={title}>
      {title}
    </StyledTitle>
  )
}
export default UiListElement

const StyledTitle = styled.span `
  display: flex;
`

