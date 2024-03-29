import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { Themed } from '@/theme'

interface Props {
  /**
   * The {@link Alert alerts} to be displayed.
   */
  children: ReactNode
}

/**
 * `UiAlertList` is a wrapper displaying multiple {@link UiAlert} instances
 * beneath each other.
 */
const UiAlertList: React.VFC<Props> = ({ children }) => {
  return (
    <AlertContainer>
      {children}
    </AlertContainer>
  )
}

export default UiAlertList

const AlertContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: fixed;
  bottom: 5rem;
  left: 2rem;
  z-index: 150;

  ${Themed.media.sm.max} {
    left: 0;
    width: 100%;
    align-items: center;
  }
`