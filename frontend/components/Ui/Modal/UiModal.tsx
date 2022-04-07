import React from 'react'
import UiModalLike, { Props as UiModalLikeProps } from '@/components/Ui/Modal/Like/UiModalLike'
import styled, { css } from 'styled-components'
import UiContainer from '@/components/Ui/Container/UiContainer'
import UiTitle from '@/components/Ui/Title/UiTitle'
import { Themed } from '@/theme'

interface Props extends UiModalLikeProps {
  /**
   * Make the modal take up a fixed, full size.
   */
  isFull?: boolean

  title?: string
}

const UiModal: React.VFC<Props> = ({
  title = null,
  isFull = false,
  ...modalProps
}) => {
  return (
    <UiModalLike {...modalProps} renderContainer={({ isOpen, isShaking, nav, children }) => (
      <DialogContainer isFull={isFull}>
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

const DialogContainer = styled.div<{ isFull: boolean }>`
  width: auto;
  ${({ isFull }) => isFull && css`
    ${UiContainer.fluidCss};
    width: 100%;
  `};
`

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
  transition-property: transform;
  
  :not([open]) {
    transition: ${({ theme }) => theme.transitions.slideOut};
    transform: scale(40%);
  }

  ${({ isShaking }) => isShaking && css`
    animation: ${Themed.animations.shake};
  `}
`

const TitleContainer = styled.div`
  display: flex;
  column-gap: 1rem;
`