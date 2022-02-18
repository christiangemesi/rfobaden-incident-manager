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

const UiCreateButton: React.VFC<Props> = ({
  title = '',
  color = 'secondary',
  isDisabled = false,
  children,
  onClick: handleClick,
}) => {
  return (
    <CreateButton onClick={handleClick} disabled={isDisabled} title={title} color={color}>
      {children}
    </CreateButton>
  )
}
export default UiCreateButton

const CreateButton = styled.button<{ color: string }>`
  background: ${({ theme, color }) => theme.colors[color].value};
  color: ${({ theme }) => theme.colors['primary'].contrast};
  
  display: flex;
  justify-content: center;
  align-items: center;
  
  transition: 250ms ease;
  transition-property: filter, box-shadow;
  
  border: none;
  border-radius: 0.5rem;
  padding: 0.3rem 1rem;
  width: 100%;
  cursor: pointer;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  
  
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
