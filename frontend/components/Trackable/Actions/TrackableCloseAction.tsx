import UiDropDown from '@/components/Ui/DropDown/UiDropDown'
import React from 'react'

interface Props {
  isClosed: boolean
  onClose: () => void
  onReopen: () => void
}

const TrackableCloseAction: React.VFC<Props> = ({
  isClosed,
  onClose: handleClose,
  onReopen: handleReopen,
}) => {
  return (
    isClosed ? (
      <UiDropDown.Item onClick={handleReopen}>
        Öffnen
      </UiDropDown.Item>
    ) : (
      <UiDropDown.Item onClick={handleClose}>
        Schliessen
      </UiDropDown.Item>
    )
  )
}
export default TrackableCloseAction