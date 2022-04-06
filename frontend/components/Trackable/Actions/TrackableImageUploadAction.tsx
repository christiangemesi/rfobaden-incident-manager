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
          <FileUploadForm
            modelId={id}
            modelName={modelName}
            onSave={handleAddImage}
            onClose={close}
          />
        </React.Fragment>
      )}</UiModal.Body>
    </UiModal>
  )
}
export default TrackableImageUploadAction
