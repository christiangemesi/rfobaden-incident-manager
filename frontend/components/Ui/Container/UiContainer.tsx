import { ReactNode } from 'react'
import styled, { css } from 'styled-components'
import StyleHelper from '@/utils/helpers/StyleHelper'
import { Themed } from '@/theme'

interface Props {
  isFluid?: boolean
  children?: ReactNode
}

const UiContainer = styled(StyleHelper.tag<Props>('div'))`
  width: 100%;
  margin-inline: auto;
  ${({ isFluid }) => !isFluid && css`
    padding: 0 0.8rem;
    ${Themed.media.sm.min} {
      max-width: ${({ theme }) => theme.breakpoints.sm.min}px;
    }
    ${Themed.media.md.min} {
      max-width: ${({ theme }) => theme.breakpoints.md.min}px;
    }
    ${Themed.media.lg.min} {
      max-width: ${({ theme }) => theme.breakpoints.lg.min}px;
    }
    ${Themed.media.xl.min} {
      max-width: ${({ theme }) => theme.breakpoints.xl.min}px;
    }
  `}
`
export default UiContainer
