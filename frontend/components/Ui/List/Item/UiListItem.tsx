import React, { EventHandler, MouseEvent, ReactNode } from 'react'
import styled, { css } from 'styled-components'
import { StyledProps } from '@/utils/helpers/StyleHelper'
import Link from 'next/link'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import UiList from '@/components/Ui/List/UiList'

export interface Props extends StyledProps {
  href?: string | URL

  /**
   * The item's title.
   */
  title?: string

  /**
   * Whether the item is currently active.
   */
  isActive?: boolean

  /**
   * Whether the item is closed.
   */
  isClosed?: boolean

  /**
   * Event caused by clicking on the list item.
   */
  onClick?: EventHandler<MouseEvent>

  /**
   * The item's content.
   */
  children: ReactNode
}

/**
 * `UiListItem` is a component that displays an item of a {@link UiList}.
 */
const UiListItem: React.VFC<Props> = ({
  href = null,
  isActive = false,
  isClosed = false,
  onClick: handleClick,
  ...props
}) => {
  if (href !== null) {
    return (
      <Link href={href} passHref>
        <StyledListItem {...props} isClosed={isClosed} as="a" isActive={isActive} onClick={handleClick} isClickable />
      </Link>
    )
  }
  return (
    <StyledListItem
      {...props}
      isClosed={isClosed}
      isActive={isActive}
      onClick={handleClick}
      isClickable={handleClick !== undefined}
    />
  )
}
export default styled(UiListItem)``

const StyledListItem = styled.li<{ isActive: boolean, isClickable: boolean, isClosed: boolean }>`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  width: 100%;
  color: ${({ theme }) => theme.colors.secondary.contrast};
  background-color: ${({ theme }) => theme.colors.secondary.value};
  text-decoration: none;
  transition: 150ms ease-out;
  transition-property: filter, background-color, opacity, border-color;
  will-change: filter, background-color, opacity, border-color;
  border: 1px solid transparent;

  ${({ isClickable }) => isClickable && css`
    :hover {
      cursor: pointer;
      background-color: ${({ theme }) => theme.colors.secondary.hover};
    }
  `}
  
  ${({ isClosed, isClickable }) => isClosed && css`
    background-color: ${({ theme }) => theme.colors.grey.value};

    ${() => isClickable && css`
      &:hover {
        background-color: ${({ theme }) => theme.colors.grey.hover};
      }
    `}
  `}

  ${({ isActive, theme }) => isActive && css`
    background-color: ${theme.colors.light.value};
    border-color: ${({ theme }) => theme.colors.grey.value};
  `}
`