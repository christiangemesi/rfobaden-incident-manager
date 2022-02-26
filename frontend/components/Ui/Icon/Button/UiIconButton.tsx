import styled from 'styled-components'
import React, { EventHandler, MouseEvent, ReactNode } from 'react'
import { ColorName, contrastDark } from '@/theme'

interface Props {
  title?: string
  color?: ColorName
  children: ReactNode
  onClick?: EventHandler<MouseEvent>
}

const UiIconButton: React.VFC<Props> = ({
  children,
  title = '',
  color,
  onClick: handleClick,
}: Props) => {

  return (
    <StyledButton type="button" title={title} color={color} onClick={handleClick}>
      {children}
    </StyledButton>
  )
}
export default styled(UiIconButton)``

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;

  border: none;
  background: transparent;
  cursor: pointer;
  margin: 0 0.2rem;
  
  will-change: background-color;
  transition: 200ms ease-out;
  transition-property: background-color;

  :hover {
    background-color: ${({ theme }) => theme.colors.grey.value};
  }
  
  &:first-child {
    margin-left: 0;
  } 
  &:last-child{
    margin-right: 0;
  }


  color: ${({
    theme,
    color,
  }) => color === undefined ? contrastDark : theme.colors[color].value};
`
