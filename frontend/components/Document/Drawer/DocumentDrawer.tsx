import UiDrawer from '@/components/Ui/Drawer/UiDrawer'
import React from 'react'
import Document from '@/models/Document'
import DocumentList from '@/components/Document/List/DocumentList'
import UiCaption from '@/components/Ui/Caption/UiCaption'
import Id from '@/models/base/Id'
import Incident from '@/models/Incident'
import Report from '@/models/Report'
import Task from '@/models/Task'
import Subtask from '@/models/Subtask'

interface Props {
  /**
   * The {@link Document documents} to be displayed.
   */
  documents: Document[]

  /**
   * Event caused by deleting a {@link Document}.
   */
  storeDocuments: (documents: Document[]) => void

  /**
   * The {@link Id} of the {@link Model} to which the documents belong.
   */
  modelId: Id<Incident | Report | Task | Subtask>

  /**
   * The name of the {@link Model} to which the documents belong.
   */
  modelName: 'incident' | 'report' | 'task' | 'subtask'

  /**
   * Event caused by adding a new {@link Document}.
   */
  onAddDocument: (document: Document) => void
}

/**
 * `DocumentDrawer` is a component which uses a {@link UiDrawer} to display {@link Document documents}.
 * The drawer is opened by clicking on an {@link UiCaption} displayed by this component.
 */
const DocumentDrawer: React.VFC<Props> = ({
  documents,
  storeDocuments,
  modelId,
  modelName,
  onAddDocument,
}) => {

  return (
    <UiDrawer size="auto">
      <UiDrawer.Trigger>{({ open }) => (
        <UiCaption onClick={open}>
          {documents.length}
          &nbsp;
          {documents.length === 1 ? 'Dokument' : 'Dokumente'}
        </UiCaption>
      )}</UiDrawer.Trigger>
      <UiDrawer.Body>
        <DocumentList
          storeDocuments={storeDocuments}
          documents={documents}
          modelId={modelId}
          modelName={modelName}
          onAddDocument={onAddDocument}
        />
      </UiDrawer.Body>
    </UiDrawer>
  )
}

export default DocumentDrawer