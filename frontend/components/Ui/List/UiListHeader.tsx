import React, { EventHandler, MouseEvent, ReactNode } from 'react'
import styled from 'styled-components'
import { StyledProps } from '@/utils/helpers/StyleHelper'

export interface ListHeaderProps extends StyledProps {
  children: ReactNode
  onClick?: EventHandler<MouseEvent>
}

const UiListHeader: React.VFC<ListHeaderProps> = ({ children, onClick: handleClick, className, style }) => {
  return (
    <ListHeader className={className} style={style} onClick={handleClick}>
      {children}
    </ListHeader>
  )
}
export default styled(UiListHeader)``

const ListHeader = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 0.5rem 0.5rem 0;

  border: none;
  border-radius: 0.5rem;
  background: transparent;

  color: ${({ theme }) => theme.colors.tertiary.contrast};
`
