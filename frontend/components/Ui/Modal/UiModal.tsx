import React from 'react'
import UiModalLike, { Props as UiModalLikeProps } from '@/components/Ui/Modal/Like/UiModalLike'
import styled, { css } from 'styled-components'
import UiContainer from '@/components/Ui/Container/UiContainer'
import UiTitle from '@/components/Ui/Title/UiTitle'
import { Themed } from '@/theme'

interface Props extends UiModalLikeProps {
  /**
   * Width sizing of the modal. Default is `'auto'`.
   * - `'auto'` makes the modal take just enough space to fit its content.
   * - `'full'` forces the modal to span the full breakpoint width.
   * - `'fixed'` forces the modal into a predefined width.
   */
  size?: 'full' | 'auto' | 'fixed'

  /**
   * Text that is displayed as the modals title.
   */
  title?: string
}

const UiModal: React.VFC<Props> = ({
  title = null,
  size = 'auto',
  ...modalProps
}) => {
  return (
    <UiModalLike {...modalProps} renderContainer={({ isOpen, isShaking, nav, children }) => (
      <DialogContainer size={size}>
        <Dialog open={isOpen} isShaking={isShaking}>
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
        </Dialog>
      </DialogContainer>
    )} />
  )
}
export default Object.assign(UiModal, {
  Trigger: UiModalLike.Trigger,
  Body: UiModalLike.Body,
})

const Dialog = styled.dialog<{ isShaking: boolean }>`
  position: static;
  display: block;
  border: none;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 90vh;
  width: 100%;

  background: ${({ theme }) => theme.colors.tertiary.value};
  color: ${({ theme }) => theme.colors.tertiary.contrast};
  
  border-radius: 1rem;
  padding: 1rem;
  box-shadow:
    0 8px 17px 2px rgba(0, 0, 0, 0.14),
    0 3px 14px 2px rgba(0, 0, 0, 0.12),
    0 5px 5px -3px rgba(0, 0, 0, 0.2);

  transition: ${({ theme }) => theme.transitions.slideIn};
  transition-property: transform, opacity;
  
  :not([open]) {
    transition: ${({ theme }) => theme.transitions.slideOut};
    transform: scale(40%);
    opacity: 0;
  }

  ${({ isShaking }) => isShaking && css`
    animation: ${Themed.animations.shake};
  `}
`

const DialogContainer = styled.div<{ size: 'full' | 'auto' | 'fixed' }>`
  width: auto;
  max-width: calc(100vw - 0.8rem);
  
  ${({ size }) => size === 'full' && css`
    ${UiContainer.fluidCss};
    & > ${Dialog} {
      ${UiContainer.fluidCss};
    }
  `};
  ${({ size }) => size === 'fixed' && css`
    ${UiContainer.fluidCss};
    & > ${Dialog} {
      ${UiContainer.fluidCss};
      ${Themed.media.lg.min} {
        width: 60vw;
      }
      ${Themed.media.xl.min} {
        width: 50vw;
      }
    }
  `};
`

const TitleContainer = styled.div`
  display: flex;
  width: 100%;
  column-gap: 1rem;
  
  & > ${UiTitle} {
    flex: 0 1 100%;
  }
`

