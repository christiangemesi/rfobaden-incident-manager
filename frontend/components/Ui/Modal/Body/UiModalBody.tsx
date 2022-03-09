import React, { MouseEvent, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
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
import { createGlobalState, useKey, useMountedState, useUpdateEffect } from 'react-use'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import ScrollHelper from '@/utils/helpers/ScrollHelper'

interface Props {
  children: ReactNode | ((state: UiModalState) => ReactNode)
}

const UiModalBody: React.VFC<Props> = ({ children }) => {
  const [globalLevel, setGlobalLevel] = useModalLevel()
  const [level, setLevel] = useState(1)

  const context = useContext(UiModalContext)
  const isMounted = useMountedState()

  useUpdateEffect(() => {
    if (context.isOpen) {
      setLevel(globalLevel + 1)
      setGlobalLevel(globalLevel + 1)
    } else {
      setLevel(globalLevel - 1)
      setGlobalLevel(globalLevel - 1)
    }
  }, [context.isOpen])

  const [isShaking, setShaking] = useState(false)

  const handleCloseAttempt = useCallback(() => {
    if (context.isPersistent) {
      setShaking(true)
      setTimeout(() => {
        setShaking(false)
      }, shakeMillis)
    } else {
      context.close()
    }
  }, [context])

  useKey('Escape', () => {
    if (!context.isOpen || level !== globalLevel) {
      return
    }
    handleCloseAttempt()
  }, { event: 'keyup' }, [context, level, globalLevel])

  const dialogRef = useRef<HTMLElement | null>(null)
  const backgroundRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (backgroundRef.current === null || dialogRef.current === null) {
      return
    }
    if (context.visibility === UiModalVisibility.OPEN) {
      ScrollHelper.disableScroll(backgroundRef.current)
      ScrollHelper.enableScrollCapture(dialogRef.current)
    }
    if (context.visibility === UiModalVisibility.CLOSING) {
      ScrollHelper.enableScroll(backgroundRef.current)
      ScrollHelper.disableScrollCapture(dialogRef.current)
    }
  }, [context.visibility])

  const content = useMemo(() => (
    context.visibility === UiModalVisibility.CLOSED || (
      <DialogContainer isShaking={isShaking} isFull={context.isFull}>
        <Dialog
          open={context.isOpen}
          visibility={context.visibility}
          isFull={context.isFull}
          onClick={ignoreClick}
          ref={dialogRef}
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
    <Background visibility={context.visibility} ref={backgroundRef} onClick={handleCloseAttempt}>
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

const useModalLevel = createGlobalState(0)

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

const DialogContainer = styled.div<{ isShaking: boolean, isFull: boolean }>`
  position: relative;
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: ${({ isFull }) => isFull && '100%'};
  
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
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 90vh;
  width: ${({ isFull }) => isFull && '100%'};
  
  ${({ theme }) => css`
    background: ${theme.colors.tertiary.value};
    color: ${theme.colors.tertiary.contrast};
  `};

  border-radius: 1rem;
  padding: 1rem;
  box-shadow:
    0 8px 17px 2px rgba(0, 0, 0, 0.14),
    0 3px 14px 2px rgba(0, 0, 0, 0.12),
    0 5px 5px -3px rgba(0, 0, 0, 0.2);

  transition: ${animationMillis}ms cubic-bezier(0.23, 1, 0.32, 1);
  transition-property: transform;

  ${({ visibility }) => visibility !== UiModalVisibility.OPEN && css`
    transform: scale(40%);
    
    // Hide the close button when closing, since it's clipping
    // the dialog, which makes it look strange when scaling down.
    // Hiding the button completely looks better than just leaving it.
    ${CloseButton} {
      display: none;
    }
  `}
`
