import React, { ReactNode } from 'react'
import styled from 'styled-components'

interface Props {
  value: number
  children: ReactNode
}

const UiBadge: React.VFC<Props> = ({ value, children }) => {
  return (
    <CircleContainer>
      {children}
      <span style={{ width: '1.5rem', textAlign: 'right' }}>{value}</span>
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

