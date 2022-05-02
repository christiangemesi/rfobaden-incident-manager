import Transport from '@/models/Transport'
import React from 'react'
import Incident from '@/models/Incident'
import UiLevel from '@/components/Ui/Level/UiLevel'
import TransportViewHeader from '@/components/Transport/View/Header/TransportViewHeader'

interface Props {
  incident: Incident
  transport: Transport
  onClose?: () => void
}

const TransportView: React.VFC<Props> = ({ incident, transport, onClose: handleClose }) => {
  return (
    <UiLevel>
      <UiLevel.Header>
        <TransportViewHeader incident={incident} transport={transport} onClose={handleClose} />
      </UiLevel.Header>
    </UiLevel>
  )
}
export default TransportView
