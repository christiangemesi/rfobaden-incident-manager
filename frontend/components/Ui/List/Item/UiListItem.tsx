import React, { EventHandler, MouseEvent, ReactNode } from 'react'
import styled, { css } from 'styled-components'
import { StyledProps } from '@/utils/helpers/StyleHelper'
import Link from 'next/link'

export interface Props extends StyledProps {
  href?: string | URL
  title?: string
  isActive?: boolean
  isClosed?: boolean
  onClick?: EventHandler<MouseEvent>
  children: ReactNode
}

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
  
  ${({ isClosed, isClickable }) => isClosed && css`
    filter: grayscale(0.8) brightness(0.8);
    opacity: 0.75;

    ${() => isClickable && css`
      &:hover {
        filter: grayscale(0.8) brightness(0.8);
        opacity: 1;
      }
    `}
  `}

  ${({ isActive, theme }) => isActive && css`
    background-color: ${theme.colors.light.value};
    border-color: ${({ theme }) => theme.colors.grey.value};
  `}

  ${({ isClickable }) => isClickable && css`
    :hover {
      cursor: pointer;
      background-color: ${({ theme }) => theme.colors.secondary.hover};
    }
  `}
`