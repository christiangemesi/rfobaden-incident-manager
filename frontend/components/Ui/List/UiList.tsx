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

const Box = styled.ul`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  row-gap: 0.4rem;

  & > ${UiListItem}:first-child, & > a:first-child > ${UiListItem} {
    &, :after {
      border-top-left-radius: 0.5rem;
      border-top-right-radius: 0.5rem;
    }
  }

  & > ${UiListItem}:last-child, & > a:last-child > ${UiListItem} {
    &, :after {
      border-bottom-left-radius: 0.5rem;
      border-bottom-right-radius: 0.5rem;
    }
  }
`