import { ElementProps } from '@/utils/helpers/StyleHelper'
import React, { ReactNode } from 'react'
import styled, { css } from 'styled-components'

interface Props extends ElementProps<HTMLDivElement> {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  isClosed: boolean
}

const UiInlineDrawer: React.VFC<Props> = ({ isOpen: _, ...props }: Props) => {
  return (
    <section {...props} />
  )
}
export default styled(UiInlineDrawer)`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;

  display: flex;

  width: 100%;
  min-height: 100%;

  background-color: ${({ theme }) => theme.colors.active.value};
  border-top: 1px solid ${({ theme }) => theme.colors.active.hover};

  will-change: transform;
  transition: 300ms cubic-bezier(.23,1,.32,1);
  transition-property: transform;

  transform: translateY(calc(100% + 4px));
  transform-origin: bottom;

  ${({ isOpen }) => isOpen && css`
    transform: translateY(0);
  `}
  ${({ isClosed }) => isClosed && css`
    border-top: 1px solid ${({ theme }) => theme.colors.activeClosed.hover};
  `}
 
`
