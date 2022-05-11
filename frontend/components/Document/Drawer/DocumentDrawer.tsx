import UiDrawer from '@/components/Ui/Drawer/UiDrawer'
import React, { ReactNode } from 'react'
import Document from '@/models/Document'
import DocumentList from '@/components/Document/List/DocumentList'
import UiCaption from '@/components/Ui/Caption/UiCaption'
import styled from 'styled-components'

interface Props {
  documents: Document[]
  storeDocuments: (documents: Document[]) => void
  modelId: number
  modelName: 'incident' | 'report' | 'task' | 'subtask'
  children?: (props: { open: () => void }) => ReactNode
  onAddDocument: (document: Document) => void
}

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
          <Caption onClick={ open }>
            {documents.length}
            &nbsp;
            {documents.length === 1 ? 'Dokument' : 'Dokumente'}
          </Caption>
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

const Caption = styled(UiCaption)`
  transition: ease 100ms;
  transition-property: transform;
  :hover {
    transform: scale(1.1);
  }
`