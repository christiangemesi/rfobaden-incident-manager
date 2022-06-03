import UiDropDown from '@/components/Ui/DropDown/UiDropDown'
import React from 'react'
import UiModal from '@/components/Ui/Modal/UiModal'
import DocumentForm from '@/components/Document/Form/DocumentForm'
import Document from '@/models/Document'
import Model from '@/models/base/Model'
import Id from '@/models/base/Id'

interface Props {
  /**
   * The record's id.
   */
  id: Id<Model>

  /**
   * The record's type.
   */
  modelName: 'incident' | 'report' | 'task' | 'subtask'

  /**
   * The document's type.
   */
  type: 'image' | 'document'

  /**
   * Event caused by adding a document.
   */
  onAddDocument: (document: Document) => void
}

/**
 * `TrackableFileUploadAction` displays a `DropDown.Item` to upload a document for a record.
 */
const TrackableFileUploadAction: React.VFC<Props> = ({
  id,
  modelName,
  type,
  onAddDocument: handleAddFile,
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
