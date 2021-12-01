import React, { ReactNode, useContext } from 'react'
import UiModalContext, { UiModalState } from '@/components/Ui/Modal/Context/UiModalContext'

interface Props {
  children: (state: UiModalState) => ReactNode
}

const UiModalActivator: React.VFC<Props> = ({ children }) => {
  const context = useContext(UiModalContext)
  return (
    <React.Fragment>
      {children(context)}
    </React.Fragment>
  )
}
export default UiModalActivator
