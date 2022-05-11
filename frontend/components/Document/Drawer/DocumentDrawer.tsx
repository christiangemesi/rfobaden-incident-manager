import UiDrawer from '@/components/Ui/Drawer/UiDrawer'
import React, { ReactNode } from 'react'
import { FileId } from '@/models/FileUpload'
import DocumentList from '@/components/Document/List/DocumentList'
import UiCaption from '@/components/Ui/Caption/UiCaption'
import styled from 'styled-components'

interface Props {
  modelId: number
  modelName: 'incident' | 'report' | 'task' | 'subtask'
  storeDocumentIds: (ids: FileId[]) => void
  documentIds: FileId[]
  children?: (props: { open: () => void }) => ReactNode
  onAddFile: (fileId: FileId) => void
}

const DocumentDrawer: React.VFC<Props> = ({
  documentIds,
  modelId,
  modelName,
  storeDocumentIds,
  children,
  onAddFile,
}) => {

  return (
    <UiDrawer size="auto">
      <UiDrawer.Trigger>{({ open }) => (
        children ? children({ open }) : (
          <Caption onClick={ open }>
            {documentIds.length}
            &nbsp;
            {documentIds.length === 1 ? 'Dokument' : 'Dokumente'}
          </Caption>
        )
      )}</UiDrawer.Trigger>
      <UiDrawer.Body>
        <DocumentList
          storeFileIds={storeDocumentIds}
          fileIds={documentIds}
          modelId={modelId}
          modelName={modelName}
          onAddFile={onAddFile}
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