import styled, { css } from 'styled-components'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import ScrollHelper from '@/utils/helpers/ScrollHelper'
import { useUpdateEffect } from 'react-use'
import { ElementProps } from '@/utils/helpers/StyleHelper'
import { noop } from '@/utils/control-flow'
import { getGlobalLevel } from '@/components/Ui/Modal/Like/UiModalLike'

interface Props extends ElementProps<HTMLDivElement> {
  isOpen: boolean
  isHidden?: boolean
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

  // The modal level at which this overlay is shown.
  // This is required to determine at which z-level this overlay has to be shown.
  const level = useRef<number | null>(null)
  level.current = level.current ?? (isOpen ? getGlobalLevel() : null)

  // Makes the overlay visible right when it opens,
  // and hides it after its close transition has ended.
  useEffect(function hideOrShow() {
    if (isOpen) {
      setHidden(false)
    } else {
      setTimeout(() => {
        level.current = null
        setHidden(true)
      }, 300)
    }
  }, [isOpen])

  return (
    <Background
      {...elementProps}
      ref={ref}
      isOpen={isOpen}
      isHidden={isHidden}
      level={level.current ?? 0}
      onClick={handleClick}
    >
      {children}
    </Background>
  )
}
export default UiOverlay

const Background = styled.div<Props & { isHidden: boolean, level: number }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: calc(100 + ${({ level }) => level});

  display: flex;
  justify-content: center;
  align-items: center;
  
  background: rgba(25, 25, 25, 0.4);
  transition: ${({ theme }) => theme.transitions.slideIn};
  transition-property: background-color, opacity, display;

  ${({ isOpen }) => !isOpen && css`
    transition: ${({ theme }) => theme.transitions.slideOut};
    background: transparent;
  `}

  ${({ isHidden }) => isHidden && css`
    z-index: -1;
    opacity: 0;
  `}
`
