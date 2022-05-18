import UiDrawer from '@/components/Ui/Drawer/UiDrawer'
import UiDropDown from '@/components/Ui/DropDown/UiDropDown'
import React, { ReactNode } from 'react'

interface Props {
  title: string
  children: (props: { close(): void }) => ReactNode
}

const TrackableEditAction: React.VFC<Props> = ({ title, children }) => {
  return (
    <UiDrawer title={title} size="fixed">
      <UiDrawer.Trigger>{({ open }) => (
        <UiDropDown.Item onClick={open}>
          Bearbeiten
        </UiDropDown.Item>
      )}</UiDrawer.Trigger>
      <UiDrawer.Body children={children} />
    </UiDrawer>
  )
}
export default TrackableEditAction
