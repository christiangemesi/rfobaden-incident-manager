import UiDrawer from '@/components/Ui/Drawer/UiDrawer'
import UiDropDown from '@/components/Ui/DropDown/UiDropDown'
import React, { ReactNode } from 'react'

interface Props {
  /**
   * The edit modal's title.
   */
  title: string

  /**
   * The edit modal's content.
   */
  children: (props: { close(): void }) => ReactNode
}

/**
 * `TrackableEditAction` displays a `DropDown.Item` to open the edit form for a record.
 */
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
