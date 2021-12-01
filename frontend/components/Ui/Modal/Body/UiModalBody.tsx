import React, { MouseEvent, ReactNode, useCallback, useContext, useMemo, useState } from 'react'
import UiModalActivator from '@/components/Ui/Modal/Activator/UiModalActivator'
import UiModalContext, {
  animationMillis,
  UiModalState,
  UiModalVisibility,
} from '@/components/Ui/Modal/Context/UiModalContext'
import styled, { css, keyframes } from 'styled-components'
import UiContainer from '../../Container/UiContainer'
import UiGrid from '../../Grid/UiGrid'
import ReactDOM from 'react-dom'
import { useMountedState } from 'react-use'
import { contrastDark } from '@/theme'
import UiIcon from '@/components/Ui/Icon/UiIcon'

interface Props {
  children: ReactNode | ((state: UiModalState) => ReactNode)
}

const UiModalBody: React.VFC<Props> = ({ children }) => {
  const context = useContext(UiModalContext)
  const isMounted = useMountedState()

  const [isShaking, setShaking] = useState(false)

  const handleOutsideClick = useCallback(() => {
    if (context.isPersistent) {
      setShaking(true)
      setTimeout(() => {
        setShaking(false)
      }, shakeMillis)
    } else {
      context.close()
    }
  }, [context])
  
  const content = useMemo(() => (
    context.visibility === UiModalVisibility.CLOSED || (
      <DialogContainer isShaking={isShaking}>
        <Dialog
          open={context.isOpen}
          visibility={context.visibility}
          isFull={context.isFull}
          onClick={ignoreClick}
        >
          <CloseButton type="button" onClick={context.close}>
            <UiIcon.CancelAction />
          </CloseButton>
          {typeof children === 'function' ? (
            <UiModalActivator children={children as (state: UiModalState) => ReactNode} />
          ) : (
            children
          )}
        </Dialog>
      </DialogContainer>
    )
  ), [children, context, isShaking])

  // Don't show the content unless the component is mounted,
  // since we can't access `document.body` otherwise.
  if (!isMounted()) {
    return <React.Fragment />
  }

  return ReactDOM.createPortal((
    <Background visibility={context.visibility} onClick={handleOutsideClick}>
      <UiContainer>
        {context.isFull ? (
          <UiGrid style={{ justifyContent: 'center', width: '100%' }}>
            <UiGrid.Col size={{ xs: 12, md: 10, lg: 8, xl: 6 }}>
              {content}
            </UiGrid.Col>
          </UiGrid>
        ) : (
          content
        )}
      </UiContainer>
    </Background>
  ), document.body)
}
export default UiModalBody

const ignoreClick = (e: MouseEvent) => {
  e.stopPropagation()
}

const Background = styled.div<{ visibility: UiModalVisibility }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 100;
  
  background: rgba(25, 25, 25, 0.4);
  transition: ${animationMillis}ms ease-in-out;
  transition-property: background-color, opacity;

  display: flex;
  justify-content: center;
  align-items: center;
  
  ${({ visibility }) => {
    if (visibility === UiModalVisibility.CLOSED) {
      return css`
        display: none;
      `
    }
    if (visibility !== UiModalVisibility.OPEN) {
      return css`
        background: transparent;
        opacity: 0;
      `
    }
  }}
`

const ShakeAnimation = keyframes`
  10%, 90% {
    transform: translateX(-1px);
  }
  20%, 80% {
    transform: translateX(2px);
  }
  30%, 50%, 70% {
    transform: translateX(-4px);
  }
  40%, 60% {
    transform: translateX(4px);
  }
`

const shakeMillis = 500

const DialogContainer = styled.div<{ isShaking: boolean }>`
  position: relative;
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: fit-content;
  
  ${({ isShaking }) => isShaking && css`
    animation-name: ${ShakeAnimation};
    animation-duration: ${shakeMillis}ms;
    animation-timing-function: ease;
  `}
`

const CloseButton = styled.button`
  position: absolute;
  right: -10px;
  top: -10px;
  padding: 0;
  
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;

  border-radius: 100%;
  border: 2px solid ${({ theme }) => theme.colors.secondary.contrast};
  color: ${({ theme }) => theme.colors.secondary.contrast};
  background: ${({ theme }) => theme.colors.secondary.value};
  
  cursor: pointer;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);

  transition: 250ms ease;
  transition-property: opacity, filter, box-shadow;
  
  :hover {
    filter: brightness(90%);
  }

  :active:not([disabled]) {
    box-shadow: none;
    filter: brightness(75%);
  }
`

const Dialog = styled.dialog<{ visibility: UiModalVisibility, isFull: boolean }>`
  position: static;
  display: block;
  border: none;
  overflow: hidden;
  max-height: 90vh;
  width: ${({ isFull }) => isFull && '100%'};

  border-radius: 1rem;
  padding: 1rem;
  box-shadow:
    0 8px 17px 2px rgba(0, 0, 0, 0.14),
    0 3px 14px 2px rgba(0, 0, 0, 0.12),
    0 5px 5px -3px rgba(0, 0, 0, 0.2);

  transition: ${animationMillis}ms ease-in-out;
  transition-property: transform;

  ${({ visibility }) => visibility !== UiModalVisibility.OPEN && css`
    transform: scale(25%);
    
    // Hide the close button when closing, since it's clipping
    // the dialog, which makes it look strange when scaling down.
    // Hiding the button completely looks better than just leaving it.
    ${CloseButton} {
      display: none;
    }
  `}
`
