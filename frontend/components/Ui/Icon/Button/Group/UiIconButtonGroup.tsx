import styled from 'styled-components'
import React, { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

const UiIconButtonGroup: React.VFC<Props> = ({
  children,
}: Props): JSX.Element => {

  return (
    <StyledGroup>
      {children}
    </StyledGroup>
  )
}
export default UiIconButtonGroup

const StyledGroup = styled.div`
  float: right;

  > button {
    margin: 0.2rem 0.5rem;
  }
`