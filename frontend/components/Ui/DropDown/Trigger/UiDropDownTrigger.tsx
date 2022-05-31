import React, { ReactNode, useContext, useMemo } from 'react'
import UiDropDownContext, { UiDropDownState } from '@/components/Ui/DropDown/Context/UiDropDownContext'

interface Props {
  /**
   * The dropdown trigger to render.
   *
   * @param state The state of the dropdown.
   */
  children: (state: UiDropDownState) => ReactNode
}

/**
 * `UiDropDownTrigger` is a component that renders a dropdown trigger.
 */
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
