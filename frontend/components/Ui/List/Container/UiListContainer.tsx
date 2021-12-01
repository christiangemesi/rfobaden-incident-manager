import React, { ReactNode } from 'react'
import styled from 'styled-components'

interface Props {
  children: ReactNode
}

const UiListContainer: React.VFC<Props> = ({ children }) => {
  return (
    <Box>
      {children}
    </Box>
  )
}
export default UiListContainer

const Box = styled.div`
  display: flex;
  flex-direction: column;
`