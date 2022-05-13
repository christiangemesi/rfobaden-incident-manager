import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { Themed } from '@/theme'

interface Props {
  children: ReactNode
}

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

  ${Themed.media.sm.max} {
    left: 0;
    width: 100%;
    align-items: center;
  }
`