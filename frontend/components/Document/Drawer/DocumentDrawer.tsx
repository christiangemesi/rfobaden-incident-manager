import UiDrawer from '@/components/Ui/Drawer/UiDrawer'
import React, { ReactNode } from 'react'
import { FileId } from '@/models/FileUpload'
import DocumentList from '@/components/Document/List/DocumentList'
import UiCaption from '@/components/Ui/Caption/UiCaption'

interface Props {
  modelId: number
  modelName: 'incident' | 'report' | 'task' | 'subtask'
  storeFileIds: (ids: FileId[]) => void
  documentIds: FileId[]
  children?: (props: { open: () => void }) => ReactNode
}

const DocumentDrawer: React.VFC<Props> = ({
  documentIds,
  modelId,
  modelName,
  storeFileIds,
  children,
}) => {

  return (
    <UiDrawer size="auto">
      <UiDrawer.Trigger>{({ open }) => (
        children ? children({ open }) : (
          <UiCaption onClick={open}>
            {documentIds.length}
            &nbsp;
            {documentIds.length === 1 ? 'Dokument' : 'Dokumente'}
          </UiCaption>
        )
      )}</UiDrawer.Trigger>
      <UiDrawer.Body>
        <DocumentList
          storeFileIds={storeFileIds}
          fileIds={documentIds}
          modelId={modelId}
          modelName={modelName} />
      </UiDrawer.Body>
    </UiDrawer>
  )
}

export default DocumentDrawer