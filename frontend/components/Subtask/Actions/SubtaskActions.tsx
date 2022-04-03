import React, { useCallback } from 'react'
import UiDropDown from '@/components/Ui/DropDown/UiDropDown'
import UiIconButton from '@/components/Ui/Icon/Button/UiIconButton'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiModal from '@/components/Ui/Modal/UiModal'
import UiTitle from '@/components/Ui/Title/UiTitle'
import SubtaskForm from '@/components/Subtask/Form/SubtaskForm'
import BackendService from '@/services/BackendService'
import Subtask from '@/models/Subtask'
import SubtaskStore from '@/stores/SubtaskStore'
import Task from '@/models/Task'
import FileUploadForm from '@/components/FileUpload/FileUploadForm'
import { FileId } from '@/models/FileUpload'
import ReportStore from '@/stores/ReportStore'

interface Props {
  task: Task
  subtask: Subtask
  onDelete?: () => void
}

const SubtaskActions: React.VFC<Props> = ({ task, subtask, onDelete: handleDeleteCb }) => {
  const handleDelete = useCallback(async () => {
    if (confirm(`Sind sie sicher, dass sie den Teilauftrag "${subtask.title}" schliessen wollen?`)) {
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

  return (
    <UiDropDown>
      <UiDropDown.Trigger>{({ toggle }) => (
        <UiIconButton onClick={toggle}>
          <UiIcon.More />
        </UiIconButton>
      )}</UiDropDown.Trigger>
      <UiDropDown.Menu>
        <UiModal isFull>
          <UiModal.Activator>{({ open }) => (
            <UiDropDown.Item onClick={open}>
              Bearbeiten
            </UiDropDown.Item>
          )}</UiModal.Activator>
          <UiModal.Body>{({ close }) => (
            <div>
              <UiTitle level={1} isCentered>
                Teilauftrag bearbeiten
              </UiTitle>
              <SubtaskForm task={task} subtask={subtask} onClose={close} />
            </div>
          )}</UiModal.Body>
        </UiModal>

        <UiModal isFull>
          <UiModal.Activator>{({ open }) => (
            <UiDropDown.Item onClick={open}>
              Bild hinzufügen
            </UiDropDown.Item>
          )}</UiModal.Activator>

          <UiModal.Body>{({ close }) => (
            <React.Fragment>
              <UiTitle level={1} isCentered>
                Bild hinzufügen
              </UiTitle>
              <FileUploadForm modelId={subtask.id} modelName="subtask" onSave={addImageId} onClose={close} />
            </React.Fragment>
          )}</UiModal.Body>
        </UiModal>

        <UiDropDown.Item onClick={handleDelete}>
          Löschen
        </UiDropDown.Item>
      </UiDropDown.Menu>
    </UiDropDown>
  )
}
export default SubtaskActions