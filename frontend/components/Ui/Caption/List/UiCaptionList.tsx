import React, { Children, ReactNode } from 'react'
import styled from 'styled-components'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiCaption from '@/components/Ui/Caption/UiCaption'

interface Props {
  /**
   * The components to be displayed in the list.
   */
  children: ReactNode
}

/**
 * `UiCaptionList` is a component that displays {@link UiCaption} in a list side by side.
 */
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
  width: 100%;
  flex-wrap: wrap;
`
