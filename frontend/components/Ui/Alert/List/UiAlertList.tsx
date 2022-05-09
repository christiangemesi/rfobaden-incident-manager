import React, { ReactNode } from 'react'
import styled from 'styled-components'

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
  position: fixed;
  bottom: 5rem;
  left: 2rem;
`