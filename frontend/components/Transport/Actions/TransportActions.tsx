import Transport, { parseTransport } from '@/models/Transport'
import React, { useCallback } from 'react'
import UiDropDown from '@/components/Ui/DropDown/UiDropDown'
import UiIconButton from '@/components/Ui/Icon/Button/UiIconButton'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiModal from '@/components/Ui/Modal/UiModal'
import UiTitle from '@/components/Ui/Title/UiTitle'
import TransportForm from '@/components/Transport/Form/TransportForm'
import BackendService, { BackendResponse } from '@/services/BackendService'
import TransportStore from '@/stores/TransportStore'
import Incident from '@/models/Incident'

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
    if (confirm(`Sind sie sicher, dass sie den Transport "${transport.title}" schliessen wollen?`)) {
      const newTransport = { ...transport, isClosed: true }
      const [data, error]: BackendResponse<Transport> = await BackendService.update(
        `incidents/${transport.incidentId}/transports`,
        transport.id,
        newTransport
      )
      if (error !== null) {
        throw error
      }
      TransportStore.save(parseTransport(data))
    }
  }, [transport])

  const handleReopen = useCallback(async () => {
    if (confirm(`Sind sie sicher, dass sie den Transport "${transport.title}" öffnen wollen?`)) {
      const newTransport = { ...transport, isClosed: false }
      const [data, error]: BackendResponse<Transport> = await BackendService.update(
        `incidents/${transport.incidentId}/transports`,
        transport.id,
        newTransport
      )
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
        <UiModal isFull>
          <UiModal.Activator>
            {({ open }) => <UiDropDown.Item onClick={open}>Bearbeiten</UiDropDown.Item>}
          </UiModal.Activator>
          <UiModal.Body>
            {({ close }) => (
              <React.Fragment>
                <UiTitle level={1} isCentered>
                  Transport bearbeiten
                </UiTitle>
                <TransportForm incident={incident} transport={transport} onClose={close} />
              </React.Fragment>
            )}
          </UiModal.Body>
        </UiModal>
        {transport.isClosed ? (
          <UiDropDown.Item onClick={handleReopen}>Öffnen</UiDropDown.Item>
        ) : (
          <UiDropDown.Item onClick={handleClose}>Schliessen</UiDropDown.Item>
        )}

        <UiDropDown.Item onClick={handleDelete}>Löschen</UiDropDown.Item>
      </UiDropDown.Menu>
    </UiDropDown>
  )
}
export default ReportActions
