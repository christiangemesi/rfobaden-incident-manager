import React, { ReactNode, useContext, useMemo } from 'react'
import UiDropDownContext, { UiDropDownState } from '@/components/Ui/DropDown/Context/UiDropDownContext'

interface Props {
  children: (state: UiDropDownState) => ReactNode
}

const UiDropDownTrigger: React.VFC<Props> = ({ children }) => {
  const context = useContext(UiDropDownContext)
  const child = useMemo(() => children(context), [children, context])
  return (
    <React.Fragment>
      {child}
    </React.Fragment>
  )
}
export default UiDropDownTrigger
