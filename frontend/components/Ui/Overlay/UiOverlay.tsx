import styled, { css } from 'styled-components'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import ScrollHelper from '@/utils/helpers/ScrollHelper'
import { useUpdateEffect } from 'react-use'
import { ElementProps } from '@/utils/helpers/StyleHelper'
import { noop } from '@/utils/control-flow'

interface Props extends ElementProps<HTMLDivElement> {
  isOpen: boolean
}

const UiOverlay: React.VFC<Props> = ({
  isOpen,
  children,
  onClick: handleClickCallback = noop,
  ...elementProps
}) => {
  const ref = useRef<HTMLDivElement | null>(null)
  useUpdateEffect(() => {
    if (ref.current === null) {
      return
    }
    if (isOpen) {
      ScrollHelper.disableScroll(ref.current)
    } else {
      ScrollHelper.enableScroll(ref.current)
    }
  }, [isOpen])
  
  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === ref.current) {
      handleClickCallback(e)
    }
  }, [handleClickCallback])

  // Shows if the overlay is completely hidden.
  // A hidden overlay is moved to a lower z-index, so it does not block pointer events.
  const [isHidden, setHidden] = useState(true)

  // Makes the overlay visible right when it opens,
  // and hides it after its close transition has ended.
  useEffect(function hideOrShow() {
    if (isOpen) {
      setHidden(false)
    } else {
      setTimeout(() => setHidden(true))
    }
  }, [isOpen])

  return (
    <Background
      {...elementProps}
      ref={ref}
      isOpen={isOpen}
      isHidden={isHidden}
      onClick={handleClick}
    >
      {children}
    </Background>
  )
}
export default UiOverlay

const Background = styled.div<Props & { isHidden: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 100;

  display: flex;
  justify-content: center;
  align-items: center;
  
  background: rgba(25, 25, 25, 0.4);
  transition: ${({ theme }) => theme.transitions.slideIn};
  transition-property: background-color, opacity, display;

  ${({ isOpen }) => !isOpen && css`
    transition: ${({ theme }) => theme.transitions.slideOut};
    background: transparent;
    opacity: 0;
  `}

  ${({ isHidden }) => isHidden && css`
    z-index: -1;
  `}
`
