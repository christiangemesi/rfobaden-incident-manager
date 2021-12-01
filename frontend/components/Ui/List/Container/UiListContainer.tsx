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
  display:inline-flex;
  padding: 8px;
  background-color: #D9DAD9;
  border-radius: 20px 20px 20px 20px;
  flex-direction: column;
  margin-left: 10px;
`