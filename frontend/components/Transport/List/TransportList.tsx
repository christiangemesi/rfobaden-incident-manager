import React from 'react'
import Transport from '@/models/Transport'
import TransportListItem from '@/components/Transport/List/Item/TransportListItem'
import styled from 'styled-components'
import { StyledProps } from '@/utils/helpers/StyleHelper'
import TransportForm from '@/components/Transport/Form/TransportForm'
import Incident from '@/models/Incident'
import TrackableList from '@/components/Trackable/List/TrackableList'

interface Props extends StyledProps {
  incident: Incident
  transports: readonly Transport[]
  selected?: Transport | null,
  onSelect?: (report: Transport) => void
  onToggle: (transport: Transport) => void
}

const TransportList: React.VFC<Props> = ({
  incident,
  transports,
  onToggle: handleToggle,
  ...listProps
}) => {
  return (
    <TrackableList
      {...listProps}
      incident={incident}
      records={[transports]}
      formTitle="Transport erfassen"
      renderForm={({ save, close }) => (
        <TransportForm incident={incident} onSave={save} onClose={close} />
      )}
      renderItem={({ record, ...itemProps }) => (
        <TransportListItem
          {...itemProps}
          record={record}
          isClosed={record.isClosed}
          onToggle={handleToggle}
        />
      )}
    />
  )
}
export default styled(TransportList)``
