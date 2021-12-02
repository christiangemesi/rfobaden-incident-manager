import React, { EventHandler, MouseEvent, ReactNode } from 'react'
import styled from 'styled-components'
import { ColorName } from '@/theme'

interface Props {
  color?: ColorName
  children: ReactNode
  onClick?: EventHandler<MouseEvent>
}

const UiListItem: React.VFC<Props> = ({
  color = 'primary',
  children,
  onClick: handleClick,
}: Props) => {
  return (
    <StyledListItem color={color} onClick={handleClick}>
      {children}
    </StyledListItem>
  )
}
export default UiListItem

const StyledListItem = styled.div`
  display: flex;
  align-items: center;
  border-radius: 0.5rem;
  margin: 0.5rem 0;
  padding: 0.5rem;
  width: 100%;
  cursor: pointer;
  background: ${({ theme, color }) => theme.colors[color ?? 'primary'].value};
  color: ${({ theme, color }) => theme.colors[color ?? 'primary'].contrast};
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);

  transition: 250ms ease;
  transition-property: filter, box-shadow;

  :first-child {
    margin-top: 0;
  }

  :last-child {
    margin-bottom: 0;
  }

  :hover {
    filter: brightness(90%);
  }

  :active {
    filter: brightness(75%);
    box-shadow: none;
  }
`