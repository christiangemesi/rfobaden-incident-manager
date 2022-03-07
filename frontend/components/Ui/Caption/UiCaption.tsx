import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { StyledProps } from '@/utils/helpers/StyleHelper'

interface Props extends StyledProps {
  children: ReactNode
}

const UiCaption: React.VFC<Props> = (props) => {
  return <Caption {...props} />
}
export default styled(UiCaption)``

const Caption = styled.div`
  font-size: 0.9em;
  opacity: 0.7;
`