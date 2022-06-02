import UiDropDown from '@/components/Ui/DropDown/UiDropDown'
import React from 'react'

interface Props {
  /**
   * Signals a closed state by using a different keyword.
   */
  isClosed: boolean

  /**
   * Event caused by clicking on `Abschliessen`.
   */
  onClose: () => void

  /**
   * Event caused by clicking on `Öffnen`.
   */
  onReopen: () => void
}

/**
 * `TrackableCloseAction` displays a `DropDown.Item` to close and reopen a record.
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