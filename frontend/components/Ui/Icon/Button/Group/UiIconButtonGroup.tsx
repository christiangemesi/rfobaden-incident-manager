import styled from 'styled-components'
import React, { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

const UiIconButtonGroup: React.VFC<Props> = ({
  children,
}: Props) => {

  return (
    <StyledGroup>
      {children}
    </StyledGroup>
  )
}
export default UiIconButtonGroup

const StyledGroup = styled.div`
  > button {
    margin: 0 0.5rem;
  }
`