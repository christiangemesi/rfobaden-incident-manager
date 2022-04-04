import { ElementProps } from '@/utils/helpers/StyleHelper'
import { ReactNode } from 'react'
import styled from 'styled-components'
import UiContainer from '@/components/Ui/Container/UiContainer'

interface Props extends ElementProps<HTMLDivElement> {
  children: ReactNode
  noPadding?: boolean
}

const UiLevelHeader = styled.section<Props>`
  ${({ noPadding }) => !noPadding && UiContainer.fluidCss}
  
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
  width: 100%;
  
  padding-top: 1rem;
  margin-bottom: 1rem;
`
export default UiLevelHeader