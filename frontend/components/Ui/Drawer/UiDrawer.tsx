import React, { useRef } from 'react'
import styled, { css } from 'styled-components'
import UiContainer from '@/components/Ui/Container/UiContainer'
import UiModalLike, { Props as UiModalLikeProps } from '@/components/Ui/Modal/Like/UiModalLike'
import { Themed } from '@/theme'

interface Props extends UiModalLikeProps {
  /**
   * Width sizing of the drawer. Default is `'auto'`.
   * - `'auto'` makes the drawer take just enough space to fit its content.
   * - `'full'` forces the drawer to span the full breakpoint width.
   */
  size?: 'full' | 'auto'

  /**
   * Determines the side from which the drawer will appear.
   * Will default to `'left'`.
   */
  position?: 'left' | 'right'
}

const UiDrawer: React.VFC<Props> = ({
  size = 'auto',
  position = 'left',
  ...modalProps
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  return (
    <UiModalLike
      {...modalProps}
      renderContainer={({ isOpen, isShaking, nav, children }) => (
        <Container
          ref={containerRef}
          isOpen={isOpen}
          isShaking={isShaking}
          size={size}
          position={position}
          onClick={(e) => e.stopPropagation()}
        >
          {nav}
          <Content>
            {children}
          </Content>
        </Container>
      )}
    />
  )
}

export default Object.assign(UiDrawer, {
  Trigger: UiModalLike.Trigger,
  Body: UiModalLike.Body,
})

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  // Take the full available space, but move the content up a bit.
  // This makes the content appear to be centered a bit better.
  height: calc(100% - 9rem);
`

const Container = styled.div<{
  isOpen: boolean
  size: 'auto' | 'full'
  position: 'left' | 'right'
  isShaking: boolean
}>`
  ${UiContainer.fluidCss};
  
  position: fixed;
  top: 0;
  ${({ position }) => position}: 0;
  width: ${({ size }) => size === 'auto' ? 'auto' : '100%'};
  height: 100vh;
  padding-top: 3rem;
  padding-bottom: 5rem;
  
  box-shadow:
    0 8px 17px 2px rgba(0, 0, 0, 0.14),
    0 3px 14px 2px rgba(0, 0, 0, 0.12),
    0 5px 5px -3px rgba(0, 0, 0, 0.2);
  
  background: ${({ theme }) => theme.colors.tertiary.value};
  color: ${({ theme }) => theme.colors.tertiary.contrast};

  ${Themed.media.xs.only} {
    max-width: 100%;
    width: 100%;
    height: calc(100vh - 2.5rem);
    top: unset;
    bottom: 0;
  }
  ${Themed.media.sm.min} {
    --breakpoint-min: ${({ theme }) => theme.breakpoints.sm.min}px;
    max-width: calc(var(--breakpoint-min) - 2.5rem);
  }
  ${Themed.media.md.min} {
    --breakpoint-min: ${({ theme }) => theme.breakpoints.md.min}px;
  }
  ${Themed.media.lg.min} {
    --breakpoint-min: ${({ theme }) => theme.breakpoints.lg.min}px;
  }
  ${Themed.media.xl.min} {
    --breakpoint-min: ${({ theme }) => theme.breakpoints.xl.min}px;
  }
  ${Themed.media.xxl.min} {
    --breakpoint-min: ${({ theme }) => theme.breakpoints.xxl.min}px;
  }
  
  transition: ${({ theme }) => theme.transitions.slideIn};
  transition-property: transform;
  ${({ isOpen, position }) => !isOpen && css`
    transition: ${({ theme }) => theme.transitions.slideOut};
    transform: translateX(${position === 'left' ? 'calc(-100% - 20px)' : 'calc(100% + 20px)'});

    ${Themed.media.xs.only} {
      transform: translateY(calc(100% + 20px));
    }
  `}

  ${({ isShaking }) => isShaking && css`
    animation: ${Themed.animations.shake};
  `}
  
  ${({ position }) => position == 'left' && css`
    > ${UiModalLike.Nav} {
      justify-content: flex-end;  
    }
  `}
`
