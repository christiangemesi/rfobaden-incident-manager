import styled, { css } from 'styled-components'
import { EventHandler, ReactNode, MouseEvent, CSSProperties } from 'react'
import StyleHelper from '@/utils/helpers/StyleHelper'
import { ColorName, contrastDark } from '@/theme'

interface Props {
  /**
   *   disables button
   */
  isDisabled?: boolean

  /**
   * take up the full width possible
   */
  isFull?: boolean

  /**
   * tooltip while hovering
   */
  title?: string

  children?: ReactNode
  onClick?: EventHandler<MouseEvent>
  className?: string
  style?: CSSProperties

  color?: ColorName
  type?: 'button' | 'submit',
}

const UiButton = styled(StyleHelper.tag('button', ({
  isDisabled = false,
  type = 'button',
  title,
  onClick,
}: Props) => ({
  disabled: isDisabled,
  title: title,
  type,
  onClick,
})))`
  display: inline-flex;
  justify-content: center;
  align-items: center;

  padding: 0.2rem 0.5rem;
  border-radius: 0.5rem;
  border: none;
  min-height: 2rem;
  font-size: 1rem;
  background: ${({ theme, color }) => theme.colors[color ?? 'primary'].value};
  color: ${({ theme, color }) => theme.colors[color ?? 'primary'].contrast};
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);

  transition: 250ms ease;
  transition-property: opacity, filter, box-shadow;

  ${({ isFull }) => isFull && css`
    width: 100%;
  `}
  :hover:not(&[disabled]) {
    cursor: pointer;
    filter: brightness(90%);
  }

  :active:not(&[disabled]) {
    cursor: pointer;
    box-shadow: none;
    filter: brightness(75%);
  }

  :disabled {
    cursor: not-allowed;
    box-shadow: none;
    background: rgb(200, 200, 200);
    color: ${contrastDark};
  }
`

export default UiButton