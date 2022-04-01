import { ElementProps } from '@/utils/helpers/StyleHelper'
import React, { forwardRef, ReactNode } from 'react'
import styled from 'styled-components'
import UiContainer from '@/components/Ui/Container/UiContainer'

interface Props extends ElementProps<HTMLDivElement> {
  children: ReactNode
}

export default styled(forwardRef<HTMLDivElement, Props>(function UiLevelContent({ ...props }, ref) {
  return (
    <section {...props} ref={ref} />
  )
}))`
  ${UiContainer.fluidCss};
  
  position: relative;
  flex: 1;
  padding-top: 1rem;
  padding-bottom: 1rem;
`
