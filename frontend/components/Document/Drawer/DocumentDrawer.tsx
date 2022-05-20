import UiDrawer from '@/components/Ui/Drawer/UiDrawer'
import React, { ReactNode } from 'react'
import Document from '@/models/Document'
import DocumentList from '@/components/Document/List/DocumentList'
import UiCaption from '@/components/Ui/Caption/UiCaption'

interface Props {
  /**
   * The documents to be displayed.
   */
  documents: Document[]

  /**
   * Callback to store the manipulated list of documents in the corresponding {@link Store}.
   */
  storeDocuments: (documents: Document[]) => void

  /**
   * The {@link Id} of the corresponding model.
   */
  modelId: number

  /**
   * The name of the corresponding model.
   */
  modelName: 'incident' | 'report' | 'task' | 'subtask'
  children?: (props: { open: () => void }) => ReactNode

  /**
   * Caused by adding a new `Document`.
   */
  onAddDocument: (document: Document) => void
}

/**
 * `DocumentDrawer` is a component which uses a {@link @UiDrawer} to display documents.
 * The `DocumentDrawer` is opening by clicking on the {@link UiCaption}.
 */
const DocumentDrawer: React.VFC<Props> = ({
  documents,
  storeDocuments,
  modelId,
  modelName,
  children,
  onAddDocument,
}) => {

  return (
    <UiDrawer size="auto">
      <UiDrawer.Trigger>{({ open }) => (
        children ? children({ open }) : (
          <UiCaption onClick={ open }>
            {documents.length}
            &nbsp;
            {documents.length === 1 ? 'Dokument' : 'Dokumente'}
          </UiCaption>
        )
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