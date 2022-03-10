import { ElementProps } from '@/utils/helpers/StyleHelper'
import React, { ReactNode } from 'react'
import styled from 'styled-components'
import UiContainer from '@/components/Ui/Container/UiContainer'

interface Props extends ElementProps<HTMLDivElement> {
  children: ReactNode
}

const UiLevelHeader: React.VFC<Props> = ({ ...props }) => {
  return (
    <section {...props} />
  )
}
export default styled(UiLevelHeader)`
  ${UiContainer.fluidCss};
  
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
  width: 100%;
  margin-bottom: 1rem;
`
