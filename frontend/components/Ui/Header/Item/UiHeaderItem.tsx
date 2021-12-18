import React from 'react'
import { useRouter } from 'next/router'
import { StyledProps } from '@/utils/helpers/StyleHelper'
import styled, { css } from 'styled-components'
import UiLink from '@/components/Ui/Link/UiLink'

interface Props extends StyledProps {
  children: string
  href: string
}

const UiHeaderItem: React.VFC<Props> = ({ href, children }) => {

  const router = useRouter()

  return (
    <NavItem data-name={children}>
      <NavLink href={href} isActive={router.asPath === href}>
        {children}
      </NavLink>
    </NavItem>
  )
}
export default UiHeaderItem

const NavItem = styled.li`
  padding: 0.75rem;

  &::before {
    display: block;
    content: attr(data-name);
    font-weight: bold;
    height: 1px;
    color: transparent;
    overflow: hidden;
    visibility: hidden;
  }
`
const NavLink = styled(UiLink)<{ isActive: boolean}>`
  color: ${({ theme }) => theme.colors.secondary.contrast};
  font-size: 1rem;
  transition: 150ms ease-out;
  transition-property: font-weight;

  ${({ isActive }) => {
    if (isActive) {
      return css`
        border-bottom: solid 1px ${({ theme }) => theme.colors.secondary.contrast};
      `
    }
    return css`
      border-bottom: none;
    `
  }}
  
  :hover {
    font-weight: bold;
  }
`