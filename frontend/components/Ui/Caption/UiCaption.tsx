import React, { ReactNode } from 'react'
import styled from 'styled-components'

interface Props {
  children: ReactNode
}

const UiCaption: React.VFC<Props> = (props) => {
  return <Caption {...props} />
}
export default UiCaption

const Caption = styled.caption`
  font-size: 0.9em;
  opacity: 0.7;
`