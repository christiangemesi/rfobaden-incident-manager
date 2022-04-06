import Transport, { parseTransport } from '@/models/Transport'
import React, { useCallback } from 'react'
import TransportStore from '@/stores/TransportStore'
import UiCheckbox from '@/components/Ui/Checkbox/UiCheckbox'
import BackendService, { BackendResponse } from '@/services/BackendService'
import TrackableListItem, { Props as TrackableListItemProps } from '@/components/Trackable/List/Item/TrackableListItem'

type Props = TrackableListItemProps<Transport>

const TransportListItem: React.VFC<Props> = ({
  record: transport,
  ...itemProps
}) => {
  const handleToggle = useCallback(async () => {
    const newTransport = { ...transport, isClosed: !transport.isClosed }
    const [data, error]: BackendResponse<Transport> = await BackendService.update(
      `incidents/${transport.incidentId}/transports`,
      transport.id,
      newTransport
    )
    if (error !== null) {
      throw error
    }
    TransportStore.save(parseTransport(data))
  }, [transport])

  return (
    <TrackableListItem
      {...itemProps}
      record={transport}
    >
      <UiCheckbox value={transport.isClosed} onChange={handleToggle} />
    </TrackableListItem>
  )
}
export default TransportListItem
