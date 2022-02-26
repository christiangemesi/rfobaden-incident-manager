import React, { Children, ReactElement, ReactNode, useMemo, useState } from 'react'
import UiDropDownItem from '@/components/Ui/DropDown/Item/UiDropDownItem'
import DropDown from 'rc-dropdown'
import Menu from 'rc-menu'
import 'rc-dropdown/assets/index.css'
import UiDropDownTrigger from '@/components/Ui/DropDown/Trigger/UiDropDownTrigger'
import { useTheme } from 'styled-components'

interface Props {
  children: ReactNode
}

const UiDropDown: React.VFC<Props> = ({ children }) => {
  const [trigger, setTrigger] = useState<ReactElement | null>(null)
  const menu = useMemo(() => {
    const items = Children.toArray(children)
    setTrigger(null)
    if (items.length !== 0 && (items[0] as ReactElement).type === UiDropDownTrigger) {
      setTrigger(items[0] as ReactElement)
      items.splice(0, 1)
    }
    return (
      <Menu>
        {items}
      </Menu>
    )
  }, [children])

  const theme = useTheme()
  return (
    <DropDown
      trigger={['click']}
      overlay={menu}
      animation="slide-up"
    >
      {trigger?.props?.children ?? <React.Fragment />}
    </DropDown>
  )
}

export default Object.assign(UiDropDown, {
  Item: UiDropDownItem,
  Trigger: UiDropDownTrigger,
})
