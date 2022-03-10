import { ElementProps } from '@/utils/helpers/StyleHelper'
import React, { ReactNode } from 'react'
import styled from 'styled-components'
import UiContainer from '@/components/Ui/Container/UiContainer'

interface Props extends ElementProps<HTMLDivElement> {
  children: ReactNode
}

const UiLevelContent: React.VFC<Props> = ({ ...props }) => {
  return (
    <section {...props} />
  )
}
export default styled(UiLevelContent)`
  ${UiContainer.fluidCss};
  
  position: relative;
  flex: 1;
  height: 100%;
  padding-top: 1rem;

`
