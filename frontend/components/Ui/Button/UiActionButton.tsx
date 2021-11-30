import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { ColorName, contrastDark } from '@/theme'

interface Props {
  title?: string
  color?: ColorName
  isDisabled?: boolean
  children: ReactNode
  onClick?: () => void
}

const UiActionButton: React.VFC<Props> = ({
  title= '',
  color= 'primary',
  isDisabled = false,
  children,
  onClick: handleClick,
}) => {
  return (
    <StyledActionButton onClick={handleClick} disabled={isDisabled} title={title} color={color}>
      {children}
    </StyledActionButton>
  )
}

export default UiActionButton

const StyledActionButton = styled.button<{color:string}>`
  background: ${({ theme, color }) => theme.colors[color ?? 'primary'].value};
  color: ${({ theme, color }) => theme.colors[color ?? 'primary'].contrast};
  width: 56px;
  height: 56px;
  align-items: center;
  border-radius: 50%;
  border: none;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  
  transition: 250ms ease;
  transition-property: opacity, filter, box-shadow;
  
  :hover:not([disabled]) {
    filter: brightness(90%);
  }
  
  :disabled {
    color: ${contrastDark};
    cursor: not-allowed;
    box-shadow: none;
    background: rgb(200, 200, 200);
  }
  
  :active:not([disabled]) {
    box-shadow: none;
    filter: brightness(75%);
  }
`
