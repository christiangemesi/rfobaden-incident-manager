import React, { CSSProperties } from 'react'

/**
 * `StyledProps` defines the props which are used to style a component using CSS.
 */
export interface StyledProps {
  className?: string
  style?: CSSProperties
}

/**
 * `ElementProps` extracts the props of a specific HTML element.
 */
export type ElementProps<E extends Element> = React.DetailedHTMLProps<React.HTMLAttributes<E>, E>

/**
 * `StyledVFC` marks a React component as styled.
 *
 * @see {@link asStyled}.
 */
type StyledVFC<T extends React.VFC<never>> =
  T extends React.VFC<infer P>
    ? P extends StyledProps
      ? T & string
      : never
    : never

/**
 * Mark a React component as styled, meaning that it accepts a `className` prop
 * and can be used inside other styled-component definitions.
 * <p>
 *   Note that this is a type-level modification,
 *   and does not have any effect on the actual component.
 * </p>
 *
 * @param fc The component to mark.
 */
export const asStyled = <T extends React.VFC<never>>(fc: T): StyledVFC<T> => (
  fc as StyledVFC<T>
)
