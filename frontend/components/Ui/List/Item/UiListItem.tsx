import React, { CSSProperties, EventHandler, MouseEvent, ReactNode } from 'react'
import styled from 'styled-components'
import { ColorName } from '@/theme'
import { StyledProps } from '@/utils/helpers/StyleHelper'

interface Props extends StyledProps {
  color?: ColorName
  children: ReactNode
  className?: string
  style?: CSSProperties
  onClick?: EventHandler<MouseEvent>
}

const UiListItem: React.VFC<Props> = ({
  color = 'primary',
  children,
  className,
  style,
  onClick: handleClick,
}: Props) => {
  return (
    <StyledListItem style={style} className={className} color={color} onClick={handleClick}>
      {children}
    </StyledListItem>
  )
}
export default styled(UiListItem)``

const StyledListItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  width: 100%;
  cursor: pointer;
  background: ${({ theme, color }) => theme.colors[color ?? 'primary'].value};
  color: ${({ theme, color }) => theme.colors[color ?? 'primary'].contrast};
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);

  transition: 250ms ease;
  transition-property: filter, box-shadow;

  :hover {
    filter: brightness(90%);
  }

  :active {
    filter: brightness(75%);
    box-shadow: none;
  }
`