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
  onClick: handleClick,
}: Props): JSX.Element => {

  return (
    <StyledButton type="button" title={title} onClick={handleClick}>
      {children}
    </StyledButton>
  )
}
export default styled(UiIconButton)``

const StyledButton = styled.button`
  background: none;
  border: none;
  margin: 0 0.2rem;
  cursor: pointer;

  transition: 250ms ease;
  transition-property: filter;

  color: ${({
    theme,
    color,
  }) => color === undefined ? contrastDark : theme.colors[color].value};

  :hover {
    cursor: pointer;
    filter: brightness(120%);
  }

  :active {
    cursor: pointer;
    filter: brightness(125%);
  }
`
