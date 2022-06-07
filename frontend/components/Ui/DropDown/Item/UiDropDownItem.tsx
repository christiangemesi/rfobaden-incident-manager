import React, { ReactNode, useCallback, useContext } from 'react'
import styled, { css } from 'styled-components'
import UiDropDownContext from '@/components/Ui/DropDown/Context/UiDropDownContext'

interface Props {
  /**
   * Event caused by clicking on the item.
   */
  onClick?: () => void

  /**
   * The item's contents.
   */
  children: ReactNode
}

/**
 * `UiDropDownItem` is an item displayed in a dropdown menu.
 */
const UiDropDownItem: React.VFC<Props> = ({ onClick: handleClick, children }) => {
  const context = useContext(UiDropDownContext)
  const click = useCallback(() => {
    if (handleClick) {
      handleClick()
    }
    context.setOpen(false)
  }, [context, handleClick])

  return (
    <Item onClick={click}>
      {children}
    </Item>
  )
}
export default UiDropDownItem

const Item = styled.li`
  display: flex;
  padding: 1rem 1rem;
  word-break: keep-all;
  white-space: nowrap;
  cursor: pointer;

  transition: 150ms ease-out;
  transition-property: background-color;
  
  ${({ theme }) => css`
    :not(:last-child) {
      border-bottom: 1px solid ${theme.colors.grey.value};
    }
    
    :hover {
      background-color: ${theme.colors.grey.hover};
    }
  `}
`