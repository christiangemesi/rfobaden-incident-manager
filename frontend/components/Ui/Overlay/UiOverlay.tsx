import styled, { css } from 'styled-components'
import React, { useCallback, useRef } from 'react'
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

  return (
    <Background {...elementProps} ref={ref} isOpen={isOpen} onClick={handleClick}>
      {children}
    </Background>
  )
}
export default UiOverlay

const Background = styled.div<Props>`
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
  transition-property: background-color, opacity, z-index;

  ${({ isOpen }) => !isOpen && css`
    z-index: -1;
    transition: ${({ theme }) => theme.transitions.slideOut};
    background: transparent;
    opacity: 0;
  `}
`
