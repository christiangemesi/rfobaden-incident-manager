import { ElementProps } from '@/utils/helpers/StyleHelper'
import { ReactNode } from 'react'
import styled, { css } from 'styled-components'
import { Themed } from '@/theme'

interface Props extends ElementProps<HTMLDivElement> {
  children: ReactNode
  noPadding?: boolean
}

const UiLevelHeader = styled.section<Props>`
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
  width: 100%;
  
  padding: 1rem 2rem;
  ${Themed.media.xs.only} {
    padding-left: 0.8rem;
    padding-right: 0.8rem;
  }

  ${({ noPadding }) => noPadding && css`
    padding-left: 0;
    padding-right: 0;
  `}
`
export default UiLevelHeader