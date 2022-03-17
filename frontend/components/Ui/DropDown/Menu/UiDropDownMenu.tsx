import React, { ReactNode, useContext, useMemo, useRef } from 'react'
import styled, { css } from 'styled-components'
import UiDropDownContext from '@/components/Ui/DropDown/Context/UiDropDownContext'
import { Themed } from '@/theme'
import { useMountedState } from 'react-use'
import ReactDOM from 'react-dom'

interface Props {
  children: ReactNode
}

const UiDropDownMenu: React.VFC<Props> = ({ children }) => {
  const context = useContext(UiDropDownContext)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const isMounted = useMountedState()

  const child = useMemo(() => (
    <Container
      ref={containerRef}
      isOpen={context.isOpen}
      bounds={containerRef.current?.getBoundingClientRect() ?? null}
      container={context.containerRef.current?.getBoundingClientRect() ?? null}
    >
      <DropDown isOpen={context.isOpen}>
        {children}
      </DropDown>
    </Container>
  ), [children, context.containerRef, context.isOpen])

  if (!isMounted()) {
    return <React.Fragment />
  }
  return ReactDOM.createPortal(child, document.body)
}
export default UiDropDownMenu

const Container = styled.div<{ isOpen: boolean, bounds: DOMRect | null, container: DOMRect | null }>`
  --min-offset: 0.8rem;
  ${Themed.media.md.min} {
    --min-offset: 4rem;
  }
  
  position: fixed;
  z-index: 100;

  
  transition-duration: 250ms;
  transition-property: z-index;
  ${({ isOpen }) => !isOpen && css`
    z-index: -1;
  `}
  
  ${({ bounds, container }) => (bounds !== null && container !== null) && css`
    top: ${container.y + container.width + 4}px;
    left: min(max(${container.left}px, var(--min-offset)), calc(100vw - ${bounds.width}px - var(--min-offset)));
  `}
`

const DropDown = styled.ul<{ isOpen: boolean }>`
  transform-origin: top center;
  transition: 300ms cubic-bezier(0.23, 1, 0.32, 1);
  transition-property: transform, opacity;

  ${({ theme }) => css`
    background: ${theme.colors.tertiary.value};
    color: ${theme.colors.tertiary.contrast};
  `};
  
  box-shadow:
    0 8px 17px 2px rgba(0, 0, 0, 0.14),
    0 3px 14px 2px rgba(0, 0, 0, 0.12),
    0 5px 5px -3px rgba(0, 0, 0, 0.2);
  
  ${({ isOpen }) => !isOpen && css`
    transform: translateY(-100%);
    opacity: 0;
  `}
`