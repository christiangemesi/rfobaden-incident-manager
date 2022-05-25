import Transport from '@/models/Transport'
import React from 'react'
import UiCheckbox from '@/components/Ui/Checkbox/UiCheckbox'
import TrackableListItem, { Props as TrackableListItemProps } from '@/components/Trackable/List/Item/TrackableListItem'

interface Props extends TrackableListItemProps<Transport> {
  onToggle: (transport: Transport) => () => void
}

const TransportListItem: React.VFC<Props> = ({
  record: transport,
  onToggle: handleToggle,
  ...itemProps
}) => {


  return (
    <TrackableListItem
      {...itemProps}
      record={transport}
    >
      <UiCheckbox value={transport.isClosed} onChange={handleToggle(transport)} />
    </TrackableListItem>
  )
}
export default TransportListItem
