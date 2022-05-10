import React, { useCallback } from 'react'
import UiDropDown from '@/components/Ui/DropDown/UiDropDown'
import UiIconButton from '@/components/Ui/Icon/Button/UiIconButton'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import SubtaskForm from '@/components/Subtask/Form/SubtaskForm'
import BackendService from '@/services/BackendService'
import Subtask from '@/models/Subtask'
import SubtaskStore from '@/stores/SubtaskStore'
import Task from '@/models/Task'
import { FileId } from '@/models/FileUpload'
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
    if (confirm(`Sind sie sicher, dass sie den Teilauftrag "${subtask.title}" abschliessen wollen?`)) {
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

  const addImageId = useCallback((fileId: FileId) => {
    SubtaskStore.save({ ...subtask, imageIds: [...subtask.imageIds, fileId]})
  }, [subtask])

  const addDocumentId = useCallback((fileId: FileId) => {
    SubtaskStore.save({ ...subtask, documentIds: [...subtask.documentIds, fileId]})
  }, [subtask])

  const storeImageIds = (ids: FileId[]) => {
    SubtaskStore.save({ ...subtask, imageIds: ids })
  }

  const storeDocumentIds = (ids: FileId[]) => {
    SubtaskStore.save({ ...subtask, documentIds: ids })
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
          onAddFile={addImageId}
          type="image"
        />
        <TrackableFileUploadAction
          id={subtask.id}
          modelName="subtask"
          onAddFile={addDocumentId}
        />

        <DocumentImageDrawer
          modelId={subtask.id}
          modelName="subtask"
          storeImageIds={storeImageIds}
          imageIds={subtask.imageIds}
        >
          {({ open }) => (
            <UiDropDown.Item onClick={open}>
              {subtask.imageIds.length}
              &nbsp;
              {subtask.imageIds.length === 1 ? 'Bild' : 'Bilder'}
            </UiDropDown.Item>
          )}
        </DocumentImageDrawer>

        <DocumentDrawer
          modelId={subtask.id}
          modelName="subtask"
          storeDocumentIds={storeDocumentIds}
          documentIds={subtask.documentIds}
        >
          {({ open }) => (
            <UiDropDown.Item onClick={open}>
              {subtask.documentIds.length}
              &nbsp;
              {subtask.documentIds.length === 1 ? 'Dokument' : 'Dokumente'}
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