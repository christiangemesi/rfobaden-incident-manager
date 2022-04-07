import UiModal from '@/components/Ui/Modal/UiModal'
import UiDropDown from '@/components/Ui/DropDown/UiDropDown'
import React, { ReactNode } from 'react'

interface Props {
  children: (props: { close(): void }) => ReactNode
}

const TrackableEditAction: React.VFC<Props> = ({ children }) => {
  return (
    <UiModal isFull>
      <UiModal.Trigger>{({ open }) => (
        <UiDropDown.Item onClick={open}>
          Bearbeiten
        </UiDropDown.Item>
      )}</UiModal.Trigger>
      <UiModal.Body children={children} />
    </UiModal>
  )
}
export default TrackableEditAction
