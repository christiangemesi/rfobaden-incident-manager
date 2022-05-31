import { ReactNode } from 'react'
import styled, { css } from 'styled-components'
import { Themed } from '@/theme'

interface Props {
  /**
   * Makes the container fluid, causing it to take up as much width as its content needs.
   */
  isFluid?: boolean

  /**
   * The container's contents.
   */
  children?: ReactNode
}

/**
 * {@code UiContainer} is a component that gives a horizontal padding to its contents.
 * IT can be used to "center" elements by forcing them to not take up the full available width.
 */
const UiContainer = styled.div<Props>`
  ${({ isFluid }) => isFluid ? sharedCss : defaultCss}
`

const sharedCss = css`
  width: 100%;
  margin-inline: auto;
`

const defaultCss = css`
  ${sharedCss};
  
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
  style: defaultCss,
})