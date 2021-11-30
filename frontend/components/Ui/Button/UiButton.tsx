import styled, { css } from 'styled-components'
import { EventHandler, ReactNode, MouseEvent, CSSProperties } from 'react'
import StyleHelper from '@/utils/helpers/StyleHelper'
import { ColorName } from '@/theme'
import { contrastDark } from '@/theme'

interface Props {
  // disables button
  isDisabled?: boolean

  // take up the full width possible
  isFull?: boolean

  // tooltip while hovering
  tooltip?: string

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
  tooltip,
  onClick,
}: Props) => ({
  disabled: isDisabled,
  title: tooltip,
  type,
  onClick,
})))`
  padding: 0.2rem 0.5rem;
  border-radius: 0.5rem;
  border: none;
  background: ${({ theme, color }) => theme.colors[color ?? 'primary'].value};
  color: ${({ theme, color }) => theme.colors[color ?? 'primary'].contrast};

  ${({ isFull }) => isFull && css`
    width: 100%;
  `}
  
  ${({ isDisabled }) => isDisabled && css`
    background: rgb(200,200,200);
    color: ${contrastDark};
  `}

  :hover:not(&[disabled]) {
    cursor: pointer;
  }
`

export default UiButton