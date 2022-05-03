import UiDrawer from '@/components/Ui/Drawer/UiDrawer'
import React, { ReactNode } from 'react'
import { FileId } from '@/models/FileUpload'
import UiCaption from '@/components/Ui/Caption/UiCaption'
import DocumentImageList from '@/components/Document/Image/List/DocumentImageList'

interface Props {
  modelId: number
  modelName: 'incident' | 'report' | 'task' | 'subtask'
  storeImageIds: (ids: FileId[]) => void
  imageIds: FileId[]
  children?: (props: { open: () => void }) => ReactNode
}

const DocumentImageDrawer: React.VFC<Props> = ({
  imageIds,
  modelId,
  modelName,
  storeImageIds,
  children,
}) => {

  return (
    <UiDrawer size="full">
      <UiDrawer.Trigger>{({ open }) => (
        children ? children({ open }) : (
          <UiCaption onClick={imageIds.length > 0 ? open : undefined}>
            {imageIds.length}
            &nbsp;
            {imageIds.length === 1 ? 'Bild' : 'Bilder'}
          </UiCaption>
        )
      )}</UiDrawer.Trigger>
      <UiDrawer.Body>
        <DocumentImageList
          storeImageIds={storeImageIds}
          imageIds={imageIds}
          modelId={modelId}
          modelName={modelName} />
      </UiDrawer.Body>
    </UiDrawer>
  )
}

export default DocumentImageDrawer
