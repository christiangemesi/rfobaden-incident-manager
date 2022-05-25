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
  title = '',
  color = 'primary',
  isDisabled = false,
  children,
  onClick: handleClick,
}) => {
  return (
    <ActionButton onClick={handleClick} disabled={isDisabled} title={title} color={color}>
      {children}
    </ActionButton>
  )
}
export default UiActionButton

const ActionButton = styled.button<{ color: ColorName }>`
  background: ${({ theme, color }) => theme.colors[color].value};
  color: ${({ theme, color }) => theme.colors[color].contrast};
  
  width: 56px;
  height: 56px;
  border: none;
  border-radius: 50%;
  box-shadow:
      0 3px 6px rgba(0, 0, 0, 0.16),
      0 3px 6px rgba(0, 0, 0, 0.23);
  
  display: flex;
  justify-content: center;
  align-items: center;
  
  transition: 250ms ease;
  transition-property: filter, box-shadow;
  
  :hover:not([disabled]) {
    filter: brightness(90%); //TODO include special hover color instead of filter
  }
  
  :disabled {
    color: ${({ theme, color }) => theme.colors[color].contrast};
    cursor: not-allowed;
    box-shadow: none;
    background: rgb(200, 200, 200);
  }
  
  :active:not([disabled]) {
    box-shadow: none;
    filter: brightness(75%);
  }
`
