import styled from 'styled-components'
import React, { EventHandler, forwardRef, MouseEvent, ReactNode } from 'react'
import { ColorName } from '@/theme'
import { StyledProps } from '@/utils/helpers/StyleHelper'

interface Props extends StyledProps {
  title?: string
  color?: ColorName
  children: ReactNode
  onClick?: EventHandler<MouseEvent>
}

const UiIconButton = forwardRef<HTMLButtonElement, Props>(function Inner ({
  children,
  title = '',
  color,
  onClick: handleClick,
  className,
  style,
}, ref) {
  return (
    <StyledButton
      type="button"
      title={title}
      color={color}
      ref={ref}
      onClick={handleClick}
      className={className}
      style={style}
    >
      {children}
    </StyledButton>
  )
})

export default styled(UiIconButton)``

const StyledButton = styled.button<{ color?: ColorName }>`
  display: inline-flex;
  align-items: center;

  border: none;
  background: transparent;
  cursor: pointer;
  margin: 0 0.2rem;
  padding: 0;
  
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
  }) => color === undefined ? theme.colors.light.contrast : theme.colors[color].value};
`
