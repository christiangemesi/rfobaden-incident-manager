import { ElementProps } from '@/utils/helpers/StyleHelper'
import React, { forwardRef, ReactNode } from 'react'
import styled from 'styled-components'
import UiContainer from '@/components/Ui/Container/UiContainer'

interface Props extends ElementProps<HTMLDivElement> {
  children: ReactNode
}

export default styled(forwardRef<HTMLDivElement, Props>(function UiLevelHeader({ ...props }, ref) {
  return (
    <section {...props} ref={ref} />
  )
}))`
  ${UiContainer.fluidCss};
  
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
  width: 100%;
  
  padding-top: 1rem;
  margin-bottom: 1rem;
`
