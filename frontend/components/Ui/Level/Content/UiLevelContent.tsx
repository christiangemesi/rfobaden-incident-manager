import { ElementProps } from '@/utils/helpers/StyleHelper'
import { ReactNode } from 'react'
import styled from 'styled-components'
import UiContainer from '@/components/Ui/Container/UiContainer'

interface Props extends ElementProps<HTMLDivElement> {
  children: ReactNode
  noPadding?: boolean
}

const UiLevelContent = styled.section<Props>`
  ${({ noPadding }) => !noPadding && UiContainer.fluidCss}
  
  position: relative;
  flex: 1;
  padding-top: 1rem;
  padding-bottom: 1rem;
`
export default UiLevelContent