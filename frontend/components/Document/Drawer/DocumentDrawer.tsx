import UiDrawer from '@/components/Ui/Drawer/UiDrawer'
import React, { ReactNode } from 'react'
import { Document } from '@/models/FileUpload'
import DocumentList from '@/components/Document/List/DocumentList'
import UiCaption from '@/components/Ui/Caption/UiCaption'

interface Props {
  documents: Document[]
  storeDocuments: (documents: Document[]) => void
  modelId: number
  modelName: 'incident' | 'report' | 'task' | 'subtask'
  children?: (props: { open: () => void }) => ReactNode
}

const DocumentDrawer: React.VFC<Props> = ({
  documents,
  storeDocuments,
  modelId,
  modelName,
  children,
}) => {

  return (
    <UiDrawer size="auto">
      <UiDrawer.Trigger>{({ open }) => (
        children ? children({ open }) : (
          <UiCaption onClick={documents.length > 0 ? open : undefined}>
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
        />
      </UiDrawer.Body>
    </UiDrawer>
  )
}

export default DocumentDrawer