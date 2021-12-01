import styled from 'styled-components'
import React, { EventHandler, MouseEvent, ReactNode } from 'react'
import { ColorName, contrastDark } from '@/theme'

interface Props {
  title?: string
  color?: ColorName
  children: ReactNode
  onClick?: EventHandler<MouseEvent>
}

const UiIconButton = ({
  children,
  title = '',
  color,
  onClick: handleClick,
}: Props): JSX.Element => {

  return (
    <StyledButton type="button" title={title} color={color} onClick={handleClick}>
      {children}
    </StyledButton>
  )
}
export default styled(UiIconButton)``

const StyledButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  margin: 0 0.2rem;
  &:first-child {
    margin-left: 0;
  } 
  &:last-child{
    margin-right: 0;
  }

  will-change: transform;
  transition: 250ms ease-in-out;
  transition-property: filter;

  color: ${({
    theme,
    color,
  }) => color === undefined ? contrastDark : theme.colors[color].value};

  :hover {
    filter: brightness(130%);
  }
`
