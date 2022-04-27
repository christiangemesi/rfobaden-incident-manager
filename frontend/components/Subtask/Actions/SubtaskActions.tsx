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
import TrackableImageUploadAction from '@/components/Trackable/Actions/TrackableImageUploadAction'
import TrackableEditAction from '@/components/Trackable/Actions/TrackableEditAction'
import UiDrawer from '@/components/Ui/Drawer/UiDrawer'
import ImageList from '@/components/Image/List/ImageList'

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

  const storeImageIds = (ids: FileId[]) => {
    SubtaskStore.save({ ...subtask, imageIds: ids })
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

        <TrackableImageUploadAction
          id={subtask.id}
          modelName="subtask"
          onAddImage={addImageId}
        />

        <UiDropDown.Item onClick={handleDelete}>
          Löschen
        </UiDropDown.Item>

        <UiDrawer size="full">
          <UiDrawer.Trigger>{({ open }) => (
            <UiDropDown.Item onClick={open}>
              {subtask.imageIds.length}
              &nbsp;
              {subtask.imageIds.length === 1 ? 'Bild' : 'Bilder'}
            </UiDropDown.Item>

          )}</UiDrawer.Trigger>
          <UiDrawer.Body>
            {/* eslint-disable-next-line react/jsx-no-undef */}
            <ImageList
              storeImageIds={storeImageIds}
              imageIds={subtask.imageIds}
              modelId={subtask.id}
              modelName="subtask" />
          </UiDrawer.Body>
        </UiDrawer>

      </UiDropDown.Menu>
    </UiDropDown>
  )
}
export default SubtaskActions