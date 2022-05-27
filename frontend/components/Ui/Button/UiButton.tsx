import styled, { css } from 'styled-components'
import React, { EventHandler, MouseEvent, ReactNode } from 'react'
import { StyledProps } from '@/utils/helpers/StyleHelper'
import { ColorName } from '@/theme'
import { PropsOf } from '@emotion/react'
import Link from 'next/link'

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

  /**
   * Use button as <a>.
   */
  href?: string
}

const UiButton: React.VFC<Props> = ({
  color = 'primary',
  type = 'button',
  href,
  ...otherProps
}) => {
  const sharedProps: PropsOf<typeof StyledButton> = {
    ...otherProps,
    color,
    disabled: otherProps.isDisabled,
  }
  if (href !== undefined) {
    return (
      <Link href={href} passHref>
        <StyledButton {...sharedProps} type={type} as="a" />
      </Link>
    )
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

  transition: 250ms ease;
  transition-property: filter, box-shadow, background-color;
  
  ${({ isFull }) => isFull && css`
    width: 100%;
  `}
  
  :hover:not(&[disabled]) {
    cursor: pointer;
    background-color: ${({ theme, color }) => theme.colors[color].hover};
  }

  :active:not(&[disabled]) {
    cursor: pointer;
    background-color: ${({ theme, color }) => theme.colors[color].hover};
  }

  :disabled {
    cursor: not-allowed;
    background: ${({ theme }) => theme.colors.backgroundgrey.hover};
    color: ${({ theme, color }) => theme.colors[color].contrast};
  }
`
