import React, { EventHandler, MouseEvent, ReactNode } from 'react'
import styled, { css } from 'styled-components'
import { StyledProps } from '@/utils/helpers/StyleHelper'
import Link from 'next/link'

export interface Props extends StyledProps {
  href?: string | URL
  title?: string
  isActive?: boolean
  onClick?: EventHandler<MouseEvent>
  children: ReactNode
}

const UiListItem: React.VFC<Props> = ({
  href = null,
  isActive = false,
  ...props
}) => {
  if (href !== null) {
    return (
      <Link href={href} passHref>
        <StyledListItem {...props} as="a" isActive={isActive} />
      </Link>
    )
  }
  return (
    <StyledListItem {...props} isActive={isActive} />
  )
}
export default styled(UiListItem)``

const StyledListItem = styled.li<{ isActive: boolean }>`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  width: 100%;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.secondary.contrast};
  background-color: ${({ theme }) => theme.colors.secondary.value};
  text-decoration: none;

  transition: 150ms ease-out;
  transition-property: filter, background-color, opacity, box-shadow;
  will-change: filter, background-color, opacity, box-shadow;
  
  ${({ isActive, theme }) => isActive && css`
    background-color: ${theme.colors.tertiary.value};
    box-shadow: 0 0 4px 2px gray;
  `}
  
  ${({ isActive }) => !isActive && css`
    :hover {
      filter: brightness(0.9);
    }
  `}
`