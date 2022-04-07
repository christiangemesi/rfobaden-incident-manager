import UiDropDown from '@/components/Ui/DropDown/UiDropDown'
import React from 'react'
import UiModal from '@/components/Ui/Modal/UiModal'
import UiTitle from '@/components/Ui/Title/UiTitle'
import FileUploadForm from '@/components/FileUpload/FileUploadForm'
import { FileId } from '@/models/FileUpload'
import Model from '@/models/base/Model'
import Id from '@/models/base/Id'

interface Props {
  id: Id<Model>
  modelName: 'incident' | 'report' | 'task' | 'subtask'
  onAddImage: (fileId: FileId) => void
}

const TrackableImageUploadAction: React.VFC<Props> = ({
  id,
  modelName,
  onAddImage: handleAddImage,
}) => {
  return (
    <UiModal title="Bild hinzufügen">
      <UiModal.Trigger>{({ open }) => (
        <UiDropDown.Item onClick={open}>
          Bild hinzufügen
        </UiDropDown.Item>
      )}</UiModal.Trigger>
      <UiModal.Body>{({ close }) => (
        <FileUploadForm
          modelId={id}
          modelName={modelName}
          onSave={handleAddImage}
          onClose={close}
        />
      )}</UiModal.Body>
    </UiModal>
  )
}
export default TrackableImageUploadAction
