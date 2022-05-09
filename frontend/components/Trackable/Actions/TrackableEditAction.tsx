import UiModal from '@/components/Ui/Modal/UiModal'
import UiDropDown from '@/components/Ui/DropDown/UiDropDown'
import React, { ReactNode } from 'react'

interface Props {
  title: string
  children: (props: { close(): void }) => ReactNode
}

const TrackableEditAction: React.VFC<Props> = ({ title, children }) => {
  return (
    <UiModal title={title} size="fixed">
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
