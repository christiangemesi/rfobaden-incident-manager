import styled from 'styled-components'
import React, { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

const UiIconButton: React.VFC<Props> = ({
  children,
}: Props): JSX.Element => {

  return (
    <StyledButton>
      {children}
    </StyledButton>
  )
}
export default styled(UiIconButton)``

const StyledButton = styled.button`
  background: none;
  border: none;
  margin: 0.2rem;
`