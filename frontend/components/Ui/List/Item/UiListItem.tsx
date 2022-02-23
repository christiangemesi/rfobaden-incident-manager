import React, { EventHandler, MouseEvent, ReactNode } from 'react'
import styled, { css } from 'styled-components'
import { StyledProps } from '@/utils/helpers/StyleHelper'
import Link from 'next/link'

export interface Props extends StyledProps {
  href?: string | URL
  isActive?: boolean
  onClick?: EventHandler<MouseEvent>
  children: ReactNode
}

const UiListItem: React.VFC<Props> = ({
  isActive = false,
  href = null,
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
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  width: 100%;
  cursor: pointer;
  overflow: hidden;
  color: ${({ theme }) => theme.colors.secondary.contrast};

  transition: 150ms ease;
  transition-property: filter, opacity;
  
  :after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    transition: 150ms ease;
    background: ${({ theme }) => theme.colors.secondary.value};
    transition-property: background-color, opacity;
  }
  
  ${({ isActive, theme }) => isActive && css`
    :after {
      background: ${theme.colors.primary.value};
      opacity: 0.6;
      filter: grayscale(0.1);
    }
  `}
  
  ${({ isActive }) => !isActive && css`
    :hover {
      filter: brightness(0.9);
    }
  `}
`