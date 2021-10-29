import styled, { css } from 'styled-components'
import { EventHandler, ReactNode, MouseEvent, CSSProperties } from 'react'
import StyleHelper from '@/utils/helpers/StyleHelper'

interface Props {
  /**
   * Disables the button.
   */
  isDisabled?: boolean

  /**
   * Causes the button to take up the full width available to it.
   */
  isFull?: boolean

  /**
   * Shows a tooltip when hovering the button.
   */
  tooltip?: string

  children?: ReactNode
  onClick?: EventHandler<MouseEvent>
  className?: string
  style?: CSSProperties
}

const UiButton = styled(StyleHelper.tag('button', ({
  isDisabled = false,
  type = 'button',
  tooltip,
  onClick,
}: Props) => ({
  disabled: isDisabled,
  title: tooltip,
  type,
  onClick,
})))`
  display: flex;
  align-items: center;
  justify-content: center;
  
  padding: 0.25rem;
  
  ${({ isFull }) => isFull && css`
    width: 100%;
  `}
  
  :hover:not(&[disabled]) {
    cursor: pointer;
  }
`
export default UiButton

