import Transport from '@/models/Transport'
import React, { useCallback } from 'react'
import UiCheckbox from '@/components/Ui/Checkbox/UiCheckbox'
import TrackableListItem, { Props as TrackableListItemProps } from '@/components/Trackable/List/Item/TrackableListItem'

interface Props extends TrackableListItemProps<Transport> {
  onToggle: (transport: Transport) => void
}

const TransportListItem: React.VFC<Props> = ({
  record: transport,
  onToggle: handleToggle,
  ...itemProps
}) => {
  const toggleTransportClose = useCallback(() => {
    handleToggle(transport)
  }, [transport, handleToggle])

  return (
    <TrackableListItem
      {...itemProps}
      record={transport}
    >
      <UiCheckbox value={transport.isClosed} onChange={toggleTransportClose} />
    </TrackableListItem>
  )
}
export default TransportListItem
