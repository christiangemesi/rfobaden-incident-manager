import React, { EventHandler, MouseEvent, ReactNode } from 'react'
import styled from 'styled-components'
import { StyledProps } from '@/utils/helpers/StyleHelper'
import UiList from '@/components/Ui/List/UiList'

export interface ListHeaderProps extends StyledProps {
  /**
   * The content of the list header.
   */
  children: ReactNode

  /**
   * Event caused by clicking on the list header.
   */
  onClick?: EventHandler<MouseEvent>
}

/**
 * `UiListHeader` displays the title bar of a {@link UiList}.
 */
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

  color: ${({ theme }) => theme.colors.light.contrast};
`
