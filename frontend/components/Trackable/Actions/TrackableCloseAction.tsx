import UiDropDown from '@/components/Ui/DropDown/UiDropDown'
import React from 'react'

interface Props {
  /**
   * Whether the trackable record is currently closed.
   */
  isClosed: boolean

  /**
   * Event caused by closing the trackable record.
   */
  onClose: () => void

  /**
   * Event caused by reopening the trackable record.
   */
  onReopen: () => void
}

/**
 * `TrackableCloseAction` displays a `DropDown.Item` that allows a trackable item
 * to be closed and reopened.
 */
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
        Abschliessen
      </UiDropDown.Item>
    )
  )
}
export default TrackableCloseAction