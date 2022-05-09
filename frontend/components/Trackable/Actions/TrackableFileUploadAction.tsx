import UiDropDown from '@/components/Ui/DropDown/UiDropDown'
import React from 'react'
import UiModal from '@/components/Ui/Modal/UiModal'
import DocumentForm from '@/components/Document/Form/DocumentForm'
import { FileId } from '@/models/FileUpload'
import Model from '@/models/base/Model'
import Id from '@/models/base/Id'

interface Props {
  id: Id<Model>
  modelName: 'incident' | 'report' | 'task' | 'subtask'
  type?: 'image'
  onAddFile: (fileId: FileId) => void
}

const TrackableFileUploadAction: React.VFC<Props> = ({
  id,
  modelName,
  type,
  onAddFile: handleAddFile,
}) => {

  const title = type === 'image' ? 'Bild' : 'Dokument'

  return (
    <UiModal title={title + ' hinzufügen'} size="fixed">
      <UiModal.Trigger>{({ open }) => (
        <UiDropDown.Item onClick={open}>
          {title + ' hinzufügen'}
        </UiDropDown.Item>
      )}</UiModal.Trigger>
      <UiModal.Body>{({ close }) => (
        <DocumentForm
          modelId={id}
          modelName={modelName}
          type={type}
          onSave={handleAddFile}
          onClose={close}
        />
      )}</UiModal.Body>
    </UiModal>
  )
}
export default TrackableFileUploadAction
