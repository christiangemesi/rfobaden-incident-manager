import React, { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

const UiDropDownTrigger: React.VFC<Props> = ({ children }) => {
  return (
    <React.Fragment>
      {children}
    </React.Fragment>
  )
}
export default UiDropDownTrigger
