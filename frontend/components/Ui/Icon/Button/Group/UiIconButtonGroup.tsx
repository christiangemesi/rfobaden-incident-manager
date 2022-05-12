import styled from 'styled-components'
import React, { ReactNode } from 'react'
import UiIconButton from '@/components/Ui/Icon/Button/UiIconButton'

interface Props {
  children: ReactNode
}

const UiIconButtonGroup: React.VFC<Props> = ({
  children,
}: Props) => {
  return (
    <StyledGroup>
      {children}
    </StyledGroup>
  )
}
export default UiIconButtonGroup

const StyledGroup = styled.div`
  display: inline-flex;
  flex-wrap: nowrap;
  > ${UiIconButton} {
    margin: 0 0.5rem;
    :first-child {
      margin-left: 0;
    }
    :last-child {
      margin-right: 0;
    }
  }
`