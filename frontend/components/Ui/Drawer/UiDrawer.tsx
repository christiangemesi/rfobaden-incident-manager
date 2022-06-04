import React, { useRef } from 'react'
import styled, { css } from 'styled-components'
import UiContainer from '@/components/Ui/Container/UiContainer'
import UiModalLike, { Props as UiModalLikeProps } from '@/components/Ui/Modal/Like/UiModalLike'
import { Themed } from '@/theme'
import UiTitle from '@/components/Ui/Title/UiTitle'

interface Props extends UiModalLikeProps {
  /**
   * Text that is displayed as the drawer's title.
   */
  title?: string

  /**
   * Width sizing of the drawer. Default is `'auto'`.
   * - `'auto'` makes the drawer take just enough space to fit its content.
   * - `'full'` forces the drawer to span the full breakpoint width.
   * - `'fixed'` forces the drawer into a predefined width.
   */
  size?: 'full' | 'auto' | 'fixed'

  /**
   * Determines the side from which the drawer will appear.
   * Will default to `'left'`.
   */
  position?: 'left' | 'right'

  /**
   * Determines how content will be aligned.
   * Will default to `'center'`.
   */
  align?: 'top' | 'center'
}

const UiDrawer: React.VFC<Props> = ({
  title = null,
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
          <Content>
            {title === null ? nav : (
              <TitleContainer>
                <UiTitle level={2}>
                  {title}
                </UiTitle>
                <div>
                  {nav}
                </div>
              </TitleContainer>
            )}
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
  margin: auto;
  width: 100%;

  ${Themed.media.xs.only} {
    margin: unset;
  }
`
const Container = styled.div<{
  isOpen: boolean
  size: 'auto' | 'full' | 'fixed'
  position: 'left' | 'right'
  isShaking: boolean
}>`
  ${UiContainer.style};

  position: fixed;
  ${({ position }) => position}: 0;
  width: ${({ size }) => size === 'auto' ? 'auto' : '100%'};
  height: 100vh;
  padding-top: 3rem;
  padding-bottom: 5rem;
  overflow-y: auto;

  box-shadow: 
          0 8px 17px 2px rgba(0, 0, 0, 0.14),
          0 3px 14px 2px rgba(0, 0, 0, 0.12), 
          5px 5px -3px rgba(0, 0, 0, 0.2);

  background: ${({ theme }) => theme.colors.light.value};
  color: ${({ theme }) => theme.colors.light.contrast};

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
const TitleContainer = styled.div`
  display: flex;
  width: 100%;
  column-gap: 1rem;
  
  & > ${UiTitle} {
    flex: 0 1 100%;
  }
  
  & > ${UiModalLike.Nav} {
  }
`
