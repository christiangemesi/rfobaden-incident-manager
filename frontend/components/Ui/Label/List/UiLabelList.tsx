import React, { ReactNode } from 'react'
import styled from 'styled-components'
import UiLabel from '@/components/Ui/Label/UiLabel'

interface Props {
  children: ReactNode
}

const UiLabelList: React.VFC<Props> = ({ children }) => {
  return (
    <List>
      {children}
    </List>
  )
}
export default UiLabelList

const List = styled.ul`
  display: flex;
  align-items: center;
  
  ${UiLabel}:first-child {
    border-top-left-radius: 0.25rem;
    border-bottom-left-radius: 0.25rem;
  }
  
  ${UiLabel}:last-child {
    border-top-right-radius: 0.25rem;
    border-bottom-right-radius: 0.25rem;
  }
  
  ${UiLabel}:not(:first-child) {
    border-left: none;
  }
`