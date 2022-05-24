import Transport, { parseTransport } from '@/models/Transport'
import React, { useCallback } from 'react'
import UiDropDown from '@/components/Ui/DropDown/UiDropDown'
import UiIconButton from '@/components/Ui/Icon/Button/UiIconButton'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import TransportForm from '@/components/Transport/Form/TransportForm'
import BackendService, { BackendResponse } from '@/services/BackendService'
import TransportStore from '@/stores/TransportStore'
import Incident from '@/models/Incident'
import TrackableEditAction from '@/components/Trackable/Actions/TrackableEditAction'
import UiPrinter from '@/components/Ui/Printer/UiPrinter'
import TransportPrintView from '@/components/Transport/PrintView/TransportPrintView'
import TrackableCloseAction from '@/components/Trackable/Actions/TrackableCloseAction'

interface Props {
  incident: Incident
  transport: Transport
  onDelete?: () => void
}

const ReportActions: React.VFC<Props> = ({ incident, transport, onDelete: handleDeleteCb }) => {
  const handleDelete = useCallback(async () => {
    if (confirm(`Sind sie sicher, dass sie den Transport "${transport.title}" löschen wollen?`)) {
      await BackendService.delete(`incidents/${transport.incidentId}/transports`, transport.id)
      if (handleDeleteCb) {
        handleDeleteCb()
      }
      TransportStore.remove(transport.id)
    }
  }, [transport, handleDeleteCb])

  const handleClose = useCallback(async () => {
    if (confirm(`Sind sie sicher, dass sie den Transport "${transport.title}" abschliessen wollen?`)) {
      const newTransport = { ...transport, isClosed: true }
      const [data, error]: BackendResponse<Transport> = await BackendService.update(`incidents/${transport.incidentId}/transports`, transport.id, newTransport)
      if (error !== null) {
        throw error
      }
      TransportStore.save(parseTransport(data))
    }
  }, [transport])

  const handleReopen = useCallback(async () => {
    if (confirm(`Sind sie sicher, dass sie den Transport "${transport.title}" öffnen wollen?`)) {
      const newTransport = { ...transport, isClosed: false }
      const [data, error]: BackendResponse<Transport> = await BackendService.update(`incidents/${transport.incidentId}/transports`, transport.id, newTransport)
      if (error !== null) {
        throw error
      }
      TransportStore.save(parseTransport(data))
    }
  }, [transport])

  return (
    <UiDropDown>
      <UiDropDown.Trigger>
        {({ toggle }) => (
          <UiIconButton onClick={toggle}>
            <UiIcon.More />
          </UiIconButton>
        )}
      </UiDropDown.Trigger>
      <UiDropDown.Menu>
        <TrackableEditAction title="Transport bearbeiten">{({ close }) => (
          <TransportForm incident={incident} transport={transport} onClose={close} />
        )}</TrackableEditAction>

        <TrackableCloseAction isClosed={transport.isClosed} onClose={handleClose} onReopen={handleReopen} />

        <UiPrinter renderContent={() => <TransportPrintView transport={transport} />}>{({ trigger }) => (
          <UiDropDown.Item onClick={trigger}>
            Drucken
          </UiDropDown.Item>
        )}</UiPrinter>

        <UiDropDown.Item onClick={handleDelete}>
          Löschen
        </UiDropDown.Item>
      </UiDropDown.Menu>
    </UiDropDown>
  )
}
export default ReportActions
