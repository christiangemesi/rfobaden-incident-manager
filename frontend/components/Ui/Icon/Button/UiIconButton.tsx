import styled from 'styled-components'
import React, { EventHandler, MouseEvent, ReactNode } from 'react'
import { ColorName, contrastDark, defaultTheme } from '@/theme'

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
}: Props): JSX.Element => {

  const cssColor = color != null ? defaultTheme.colors[color].value : contrastDark

  return (
    <StyledButton title={title} onClick={handleClick} cssColor={cssColor}>
      {children}
    </StyledButton>
  )
}
export default styled(UiIconButton)``

const StyledButton = styled.button<{ cssColor: string }>`
  background: none;
  border: none;
  margin: 0.2rem;

  color: ${({ cssColor }) => cssColor}
`
