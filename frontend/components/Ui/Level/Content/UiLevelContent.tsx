import { ElementProps } from '@/utils/helpers/StyleHelper'
import { ReactNode } from 'react'
import styled, { css } from 'styled-components'
import { Themed } from '@/theme'

interface Props extends ElementProps<HTMLDivElement> {
  children: ReactNode
  noPadding?: boolean
}

const UiLevelContent = styled.section<Props>`
  position: relative;
  flex: 1;
  padding: 0 2rem 1rem 2rem;
  
  ${Themed.media.xs.only} {
    padding-left: 0.8rem;
    padding-right: 0.8rem;
  }
  
  ${({ noPadding }) => noPadding && css`
    padding-left: 0;
    padding-right: 0;
  `}
`
export default UiLevelContent