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
const IncidentCreateButton:React.VFC<Props> = ({
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
export default IncidentCreateButton

const CreateButton = styled.button<{ color: string }>`
  color: ${({ theme }) => theme.colors.primary.contrast };
  background: ${({ theme, color }) => theme.colors[color].value};

  width: 100%;
  height: 15rem;
  padding: 1rem;

  border: none;
  border-radius: 0.5rem;

  display: flex;
  justify-content: center;
  align-items: center;
  
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);

  transition: 250ms ease;
  transition-property: filter, box-shadow;

  :hover:not(&[disabled]), :active:not(&[disabled]) {
    cursor: pointer;
    filter: brightness(90%);
  }

  :active:not(&[disabled]) {
    box-shadow: none;
  }
`