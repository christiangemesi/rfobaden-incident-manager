import styled, { css } from 'styled-components'
import React, { EventHandler, MouseEvent, ReactNode } from 'react'
import { StyledProps } from '@/utils/helpers/StyleHelper'
import { ColorName } from '@/theme'
import { PropsOf } from '@emotion/react'

export interface Props extends StyledProps {

  /**
   * Tooltip while hovering.
   */
  title?: string

  /**
   * take up the full width possible
   */
  isFull?: boolean

  /**
   * Disables the button.
   */
  isDisabled?: boolean

  /**
   * The color of the button.
   */
  color?: ColorName

  /**
   * The button type.
   */
  type?: 'button' | 'submit'

  /**
   * Click event handler.
   */
  onClick?: EventHandler<MouseEvent>

  /**
   * The button content.
   */
  children?: ReactNode
}

const UiButton: React.VFC<Props> = ({
  color = 'primary',
  type = 'button',
  ...otherProps
}) => {
  const sharedProps: PropsOf<typeof StyledButton> = {
    ...otherProps,
    color,
    disabled: otherProps.isDisabled,
  }
  return <StyledButton {...sharedProps} type={type} />
}
export default styled(UiButton)``

const StyledButton = styled.button<{ isFull: boolean, isDisabled: boolean, color: ColorName }>`
  display: inline-flex;
  justify-content: center;
  align-items: center;

  padding: 0.2rem 0.5rem;
  border-radius: 0.5rem;
  border: none;
  min-height: 2rem;
  font-size: 1rem;
  background: ${({ theme, color }) => theme.colors[color].value};
  color: ${({ theme, color }) => theme.colors[color].contrast};
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);

  transition: 250ms ease;
  transition-property: filter, box-shadow;
  
  ${({ isFull }) => isFull && css`
    width: 100%;
  `}
  :focus {
    outline: 1px solid ${({ theme, color }) => theme.colors[color].contrast};
  }
  
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
    color: ${({ theme, color }) => theme.colors[color].contrast};
  }
`
