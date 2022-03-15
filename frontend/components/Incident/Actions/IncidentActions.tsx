import React, { useCallback } from 'react'
import UiDropDown from '@/components/Ui/DropDown/UiDropDown'
import UiIconButton from '@/components/Ui/Icon/Button/UiIconButton'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiModal from '@/components/Ui/Modal/UiModal'
import UiTitle from '@/components/Ui/Title/UiTitle'
import ReportForm from '@/components/Report/Form/ReportForm'
import IncidentForm from '@/components/Incident/Form/IncidentForm'
import Incident, { parseIncident } from '@/models/Incident'
import BackendService, { BackendResponse } from '@/services/BackendService'
import IncidentStore from '@/stores/IncidentStore'

interface Props {
  incident: Incident
  onDelete?: () => void
}

const IncidentActions: React.VFC<Props> = ({ incident, onDelete: handleDeleteCb }) => {
  const handleClose = useCallback(async () => {
    const message = prompt(`Sind sie sicher, dass sie das Ereignis "${incident.title}" schliessen wollen?\nGrund:`)
    if (message === null) {
      return
    }
    if (message.trim().length === 0) {
      confirm(`Das Ereignis "${incident.title}" wurde nicht geschlossen.\nDie Begründung fehlt.`)
      return
    }
    const [data, error]: BackendResponse<Incident> = await BackendService.update(`incidents/${incident.id}/close`, { message })
    if (error !== null) {
      throw error
    }
    IncidentStore.save(parseIncident(data))
  }, [incident])

  const handleReopen = useCallback(async () => {
    if (confirm(`Sind sie sicher, dass sie das Ereignis "${incident.title}" wieder öffnen wollen?`)) {
      const [data, error] = await BackendService.update<number, Incident>(`incidents/${incident.id}/reopen`, incident.id)
      if (error !== null) {
        throw error
      }
      IncidentStore.save(parseIncident(data))
    }
  }, [incident])

  const handleDelete = useCallback(async () => {
    if (confirm(`Sind sie sicher, dass sie das Ereignis "${incident.title}" löschen wollen?`)) {
      const error = await BackendService.delete('incidents', incident.id)
      if (error !== null) {
        throw error
      }
      if (handleDeleteCb) {
        handleDeleteCb()
      }
      IncidentStore.remove(incident.id)
    }
  }, [handleDeleteCb, incident])
  
  return (
    <UiDropDown>
      <UiDropDown.Trigger>
        <UiIconButton>
          <UiIcon.More />
        </UiIconButton>
      </UiDropDown.Trigger>

      <UiModal isFull>
        <UiModal.Activator>{({ open }) => (
          <UiDropDown.Item onClick={open}>
            Neue Meldung
          </UiDropDown.Item>
        )}</UiModal.Activator>
        <UiModal.Body>{({ close }) => (
          <React.Fragment>
            <UiTitle level={1} isCentered>
              Meldung erfassen
            </UiTitle>
            <ReportForm incident={incident} onClose={close} />
          </React.Fragment>
        )}</UiModal.Body>
      </UiModal>

      <UiModal isFull>
        <UiModal.Activator>{({ open }) => (
          <UiDropDown.Item onClick={open}>Bearbeiten</UiDropDown.Item>
        )}</UiModal.Activator>
        <UiModal.Body>{({ close }) => (
          <React.Fragment>
            <UiTitle level={1} isCentered>
              Ereignis bearbeiten
            </UiTitle>
            <IncidentForm incident={incident} onClose={close} />
          </React.Fragment>
        )}</UiModal.Body>
      </UiModal>

      {incident.isClosed ? (
        <UiDropDown.Item onClick={handleReopen}>
          Öffnen
        </UiDropDown.Item>
      ) : (
        <UiDropDown.Item onClick={handleClose}>
          Schliessen
        </UiDropDown.Item>
      )}
      <UiDropDown.Item onClick={handleDelete}>Löschen</UiDropDown.Item>
    </UiDropDown>
  )
}
export default IncidentActions