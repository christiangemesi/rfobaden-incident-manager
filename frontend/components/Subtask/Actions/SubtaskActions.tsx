import React, { useCallback } from 'react'
import UiDropDown from '@/components/Ui/DropDown/UiDropDown'
import UiIconButton from '@/components/Ui/Icon/Button/UiIconButton'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiTitle from '@/components/Ui/Title/UiTitle'
import SubtaskForm from '@/components/Subtask/Form/SubtaskForm'
import BackendService from '@/services/BackendService'
import Subtask from '@/models/Subtask'
import SubtaskStore from '@/stores/SubtaskStore'
import Task from '@/models/Task'
import { FileId } from '@/models/FileUpload'
import TrackableImageUploadAction from '@/components/Trackable/Actions/TrackableImageUploadAction'
import TrackableEditAction from '@/components/Trackable/Actions/TrackableEditAction'

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
        <TrackableEditAction>{({ close }) => (
          <React.Fragment>
            <UiTitle level={1} isCentered>
              Teilauftrag bearbeiten
            </UiTitle>
            <SubtaskForm task={task} subtask={subtask} onClose={close} />
          </React.Fragment>
        )}</TrackableEditAction>

        <TrackableImageUploadAction
          id={subtask.id}
          modelName="subtask"
          onAddImage={addImageId}
        />

        <UiDropDown.Item onClick={handleDelete}>
          Löschen
        </UiDropDown.Item>
      </UiDropDown.Menu>
    </UiDropDown>
  )
}
export default SubtaskActions