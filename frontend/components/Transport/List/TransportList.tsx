import React from 'react'
import Transport from '@/models/Transport'
import TransportListItem from '@/components/Transport/List/Item/TransportListItem'
import styled from 'styled-components'
import { StyledProps } from '@/utils/helpers/StyleHelper'
import UiTitle from '@/components/Ui/Title/UiTitle'
import TransportForm from '@/components/Transport/Form/TransportForm'
import Incident from '@/models/Incident'
import TrackableList from '@/components/Trackable/List/TrackableList'

interface Props extends StyledProps {
  incident: Incident
  transports: readonly Transport[]
  selected?: Transport | null,
  onSelect?: (report: Transport) => void
}

const TransportList: React.VFC<Props> = ({
  incident,
  transports,
  ...listProps
}) => {
  return (
    <TrackableList
      {...listProps}
      records={[transports]}
      renderForm={({ save, close }) => (
        <React.Fragment>
          <UiTitle level={1} isCentered>
            Transport erfassen
          </UiTitle>
          <TransportForm incident={incident} onSave={save} onClose={close} />
        </React.Fragment>
      )}
      renderItem={({ record, ...itemProps }) => (
        <TransportListItem
          {...itemProps}
          record={record}
          isClosed={record.isClosed}
        />
      )}
    />
  )
}
export default styled(TransportList)``
