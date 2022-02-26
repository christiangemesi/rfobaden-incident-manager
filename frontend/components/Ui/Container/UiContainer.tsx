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
    ${() => variables}
    padding: 0 var(--ui-container--padding);
    ${Themed.media.sm.min} {
      max-width: ${({ theme }) => theme.breakpoints.sm.min}px;
    }
    ${Themed.media.md.min} {
      max-width: 100%;
    }
  `}
`

const variables = css`
  --ui-container--padding: 0.8rem;

  ${Themed.media.md.min} {
    --ui-container--padding: 4rem;
  }
`

export default Object.assign(UiContainer, {
  variables,
})