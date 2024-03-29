import React, { ReactNode } from 'react'
import { useRouter } from 'next/router'
import { StyledProps } from '@/utils/helpers/StyleHelper'
import styled, { css } from 'styled-components'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import Link from 'next/link'

interface Props extends StyledProps {
  /**
   * The link of the item.
   */
  href?: string

  /**
   * Event caused by clicking on the item.
   */
  onClick?: () => void

  /**
   * The title of the item.
   */
  title?: string

  /**
   * The content of the item.
   */
  children: ReactNode
}

/**
 * `PageHeaderItem` is a component that displays an item inside a {@link PageHeader}.
 */
const PageHeaderItem: React.VFC<Props> = ({ href, onClick, title, children }) => {
  const router = useRouter()
  return (
    <NavItem>
      {href ? (
        <Link href={href} passHref>
          <NavLink isActive={router.asPath === href} title={title}>
            {children}
          </NavLink>
        </Link>
      ) : (
        <NavLink as="span" isActive={false} title={title} onClick={onClick}>
          {children}
        </NavLink>
      )}
    </NavItem>
  )
}
export default PageHeaderItem

const NavItem = styled.li`
  padding: 0.75rem 0;
  list-style: none;
`

const NavLink = styled.a<{ isActive: boolean }>`
  display: flex;
  align-items: center;

  font-size: 1rem;
  letter-spacing: 1px;
  color: currentColor;
  text-decoration: none;
  cursor: pointer;

  transition: 150ms ease;
  transition-property: text-shadow;

  ${({ isActive }) => {
    if (isActive) {
      return css`
        border-bottom: solid 1px currentColor;
      `
    }
    return css`
      border-bottom: none;
    `
  }}
  
  :hover {
    text-shadow: 0 0 1px black;

    ${UiIcon} {
      transform: scale(1.1);
    }
  }

  ${UiIcon} {
    transition: 150ms ease;
    transition-property: transform;

    :not(:first-child) {
      margin-left: 0.25rem;
    }

    :not(:last-child) {
      margin-right: 0.25rem;
    }
  }
`
