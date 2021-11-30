import React, { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

const UiBadge: React.VFC<Props> = ({ children }) => {
  return (
    <h1>I am a badge{children}</h1>
  )
}
export default UiBadge

