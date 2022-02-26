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
      padding: 0 4rem;
      max-width: 100%;
    }
  `}
`
export default UiContainer
