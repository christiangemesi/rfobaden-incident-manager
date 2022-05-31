import React, { ReactNode } from 'react'
import styled from 'styled-components'

interface Props {
  /**
   * The number displayed on the {@link UiBadge}.
   */
  value: number

  /**
   * The component to which the {@link UiBadge} is applied.
   */
  children: ReactNode
}

/**
 * `UiBadge` is a component that attaches a number to a component.
 */
const UiBadge: React.VFC<Props> = ({ value, children }) => {
  return (
    <CircleContainer>
      {children}
      <Counter>{value}</Counter>
    </CircleContainer>
  )
}
export default UiBadge

const CircleContainer = styled.span`
  color: ${({ theme }) => theme.colors.primary.contrast};
  background-color: ${({ theme }) => theme.colors.primary.value};
  padding: 0.5rem;
  border-radius: 0.5rem;
  display: inline-flex;
  align-items: center;
`

const Counter = styled.span`
  width: 1.5rem;
  text-align: right;
`

