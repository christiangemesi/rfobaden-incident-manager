import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { ColorName } from '@/theme'

interface Props {
  title?: string
  color?: ColorName
  isDisabled?: boolean
  children: ReactNode
  onClick?: () => void
}

const UiActionButton: React.VFC<Props> = ({
  //TODO set color
  title= '',
  isDisabled = false,
  children,
  onClick: handleClick,
}) => {
  return (
    <StyledActionButton onClick={handleClick} disabled={isDisabled} title={title}>
      {children}
    </StyledActionButton>
  )
}

export default UiActionButton

const StyledActionButton = styled.button`
  background: ${({ theme, color }) => theme.colors[color ?? 'primary'].value};
  width: 56px;
  height: 56px;
  align-items: center;
  border-radius:50%;
  border: none;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  
  :hover:not([disabled]) {
    opacity: 0.9;
  }
  :disabled{
    cursor: not-allowed;
    box-shadow: none;
    background: rgb(200,200,200);
  }
  
  :active :not([disabled]){;
    filter: brightness(75%);
  }
`
