import React, { ReactNode } from 'react'
import styled from 'styled-components'

interface Props {
  children: ReactNode
}

const UiList: React.VFC<Props> = ({ children }) => {
  return (
    <Box>
      {children}
    </Box>
  )
}
export default UiList

const Box = styled.ul`
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
`