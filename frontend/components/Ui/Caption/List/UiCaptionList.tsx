import React from 'react'
import { Children, ReactNode } from 'react'
import styled from 'styled-components'
import UiIcon from '@/components/Ui/Icon/UiIcon'

interface Props {
  children: ReactNode
}

const UiCaptionList: React.VFC<Props> = ({ children }) => {
  return (
    <List>
      {Children.toArray(children).filter((child) => child).map((child, i) => child && (
        <React.Fragment key={i}>
          {i !== 0 && <UiIcon.Dot />}
          {child}
        </React.Fragment>
      ))}
    </List>
  )
}
export default UiCaptionList

const List = styled.ul`
  display: flex;
  align-items: center;
`
