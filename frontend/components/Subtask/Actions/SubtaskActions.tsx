import React, { useCallback } from 'react'
import UiDropDown from '@/components/Ui/DropDown/UiDropDown'
import UiIconButton from '@/components/Ui/Icon/Button/UiIconButton'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import SubtaskForm from '@/components/Subtask/Form/SubtaskForm'
import BackendService from '@/services/BackendService'
import Subtask from '@/models/Subtask'
import SubtaskStore from '@/stores/SubtaskStore'
import Task from '@/models/Task'
import Document from '@/models/Document'
import TrackableFileUploadAction from '@/components/Trackable/Actions/TrackableFileUploadAction'
import TrackableEditAction from '@/components/Trackable/Actions/TrackableEditAction'
import UiPrinter from '@/components/Ui/Printer/UiPrinter'
import SubtaskPrintView from '@/components/Subtask/PrintView/SubtaskPrintView'
import DocumentImageDrawer from '@/components/Document/Image/Drawer/DocumentImageDrawer'
import DocumentDrawer from '@/components/Document/Drawer/DocumentDrawer'

interface Props {
  task: Task
  subtask: Subtask
  onDelete?: () => void
}

const SubtaskActions: React.VFC<Props> = ({ task, subtask, onDelete: handleDeleteCb }) => {
  const handleDelete = useCallback(async () => {
    if (confirm(`Sind sie sicher, dass sie den Teilauftrag "${subtask.title}" löschen wollen?`)) {
      const error = await BackendService.delete(`incidents/${subtask.incidentId}/reports/${subtask.reportId}/tasks/${subtask.taskId}/subtasks`, subtask.id)
      if (error !== null) {
        throw error
      }
      if (handleDeleteCb) {
        handleDeleteCb()
      }
      SubtaskStore.remove(subtask.id)
    }
  }, [subtask, handleDeleteCb])

  const addImage = useCallback((image: Document) => {
    SubtaskStore.save({ ...subtask, images: [...subtask.images, image]})
  }, [subtask])

  const addDocument = useCallback((document: Document) => {
    SubtaskStore.save({ ...subtask, documents: [...subtask.documents, document]})
  }, [subtask])

  const storeImages = (images: Document[]) => {
    SubtaskStore.save({ ...subtask, images: images })
  }

  const storeDocuments = (documents: Document[]) => {
    SubtaskStore.save({ ...subtask, documents: documents })
  }

  return (
    <UiDropDown>
      <UiDropDown.Trigger>{({ toggle }) => (
        <UiIconButton onClick={toggle}>
          <UiIcon.More />
        </UiIconButton>
      )}</UiDropDown.Trigger>
      <UiDropDown.Menu>
        <TrackableEditAction title="Teilauftrag bearbeiten">{({ close }) => (
          <SubtaskForm task={task} subtask={subtask} onClose={close} />
        )}</TrackableEditAction>

        <TrackableFileUploadAction
          id={subtask.id}
          modelName="subtask"
          onAddDocument={addImage}
          type="image"
        />
        <TrackableFileUploadAction
          id={subtask.id}
          modelName="subtask"
          onAddDocument={addDocument}
          type="document"
        />

        <DocumentImageDrawer
          images={subtask.images}
          storeImages={storeImages}
          modelId={subtask.id}
          modelName="subtask"
          onAddImage={addImage}
        >
          {({ open }) => (
            <UiDropDown.Item onClick={open}>
              {subtask.images.length}
              &nbsp;
              {subtask.images.length === 1 ? 'Bild' : 'Bilder'}
            </UiDropDown.Item>
          )}
        </DocumentImageDrawer>

        <DocumentDrawer
          documents={subtask.documents}
          storeDocuments={storeDocuments}
          modelId={subtask.id}
          modelName="subtask"
          onAddDocument={addDocument}
        >
          {({ open }) => (
            <UiDropDown.Item onClick={open}>
              {subtask.documents.length}
              &nbsp;
              {subtask.documents.length === 1 ? 'Dokument' : 'Dokumente'}
            </UiDropDown.Item>
          )}
        </DocumentDrawer>

        <UiPrinter renderContent={() => <SubtaskPrintView subtask={subtask} />}>{({ trigger }) => (
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
export default SubtaskActions