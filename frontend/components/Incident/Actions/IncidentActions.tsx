import React, { useCallback } from 'react'
import UiDropDown from '@/components/Ui/DropDown/UiDropDown'
import UiIconButton from '@/components/Ui/Icon/Button/UiIconButton'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import IncidentForm from '@/components/Incident/Form/IncidentForm'
import Incident, { parseIncident } from '@/models/Incident'
import BackendService, { BackendResponse } from '@/services/BackendService'
import IncidentStore from '@/stores/IncidentStore'
import { useCurrentUser } from '@/stores/SessionStore'
import { isAdmin } from '@/models/User'
import { FileId } from '@/models/FileUpload'
import TrackableImageUploadAction from '@/components/Trackable/Actions/TrackableImageUploadAction'
import TrackableCloseAction from '@/components/Trackable/Actions/TrackableCloseAction'
import TrackableEditAction from '@/components/Trackable/Actions/TrackableEditAction'

interface Props {
  incident: Incident
  onDelete?: () => void
}

const IncidentActions: React.VFC<Props> = ({ incident, onDelete: handleDeleteCb }) => {
  const currentUser = useCurrentUser()

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

  const addImageId = useCallback((fileId: FileId) => {
    IncidentStore.save({ ...incident, imageIds: [...incident.imageIds, fileId]})
  }, [incident])

  return (
    <UiDropDown>
      <UiDropDown.Trigger>{({ toggle }) => (
        <UiIconButton onClick={toggle}>
          <UiIcon.More />
        </UiIconButton>
      )}</UiDropDown.Trigger>
      <UiDropDown.Menu>
        <TrackableEditAction title="Ereignis bearbeiten">{({ close }) => (
          <IncidentForm incident={incident} onClose={close} />
        )}</TrackableEditAction>

        {isAdmin(currentUser) && (
          <TrackableCloseAction isClosed={incident.isClosed} onClose={handleClose} onReopen={handleReopen} />
        )}

        <TrackableImageUploadAction
          id={incident.id}
          modelName="incident"
          onAddImage={addImageId}
        />

        {isAdmin(currentUser) && (
          <UiDropDown.Item onClick={handleDelete}>Löschen</UiDropDown.Item>
        )}
      </UiDropDown.Menu>
    </UiDropDown>
  )
}
export default IncidentActions