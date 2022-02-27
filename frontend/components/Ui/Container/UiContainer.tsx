import { ReactNode } from 'react'
import styled, { css } from 'styled-components'
import { Themed } from '@/theme'

interface Props {
  isFluid?: boolean
  children?: ReactNode
}

const UiContainer = styled.div<Props>`
  width: 100%;
  margin-inline: auto;
  ${({ isFluid }) => !isFluid && fluidCss}
`

const fluidCss = css`
  padding-left: 0.8rem;
  padding-right: 0.8rem;
  
  ${Themed.media.sm.min} {
    max-width: ${({ theme }) => theme.breakpoints.sm.min}px;
  }
  ${Themed.media.md.min} {
    max-width: 100%;
    
    padding-right: 4rem;
    padding-left: 4rem;
  }
`

export default Object.assign(UiContainer, {
  fluidCss,
})