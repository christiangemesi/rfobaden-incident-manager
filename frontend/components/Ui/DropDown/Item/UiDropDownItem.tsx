import React, { ReactNode } from 'react'
import { Item } from 'rc-menu'
import styled, { css } from 'styled-components'

interface Props {
  onClick?: () => void
  children: ReactNode
}

const UiDropDownItem: React.VFC<Props> = ({ onClick: handleClick, children }) => {
  return (
    <StyledItem unselectable="on" onClick={handleClick} $isClickable={handleClick !== undefined}>
      {children}
    </StyledItem>
  )
}
export default UiDropDownItem

const StyledItem = styled(Item)<{ $isClickable: boolean }>`
  .rc-dropdown .rc-dropdown-menu > &.rc-dropdown-menu-item {
    font-size: 1rem;
    font-family: ${({ theme }) => theme.fonts.body};
    color: ${({ theme }) => theme.colors.tertiary.contrast};
    background-color: ${({ theme }) => theme.colors.tertiary.value};
    
    
    ${({ theme, $isClickable }) => $isClickable && css`
      cursor: pointer;
      transition: 150ms ease-out;
      transition-property: background-color;
      :hover {
        background-color: ${theme.colors.grey.value};
      }
    `}
    
    :after {
      display: none;
    }
  }
`