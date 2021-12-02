import React, { ReactNode } from 'react'
import styled from 'styled-components'
import UiListItem from '@/components/Ui/List/Item/UiListItem'

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

const Box = styled.div`
  display: flex;
  flex-direction: column;
  > ${UiListItem} {
    margin: 0.5rem 0;

    :first-child {
      margin-top: 0;
    }

    :last-child {
      margin-bottom: 0;
    }
  }
`