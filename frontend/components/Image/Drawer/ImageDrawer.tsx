import UiDrawer from '@/components/Ui/Drawer/UiDrawer'
import ImageList from '@/components/Image/List/ImageList'
import React, { ReactNode } from 'react'
import { FileId } from '@/models/FileUpload'
import UiCaption from '@/components/Ui/Caption/UiCaption'

interface Props {
  modelId: number
  modelName: 'incident' | 'report' | 'task' | 'subtask'
  storeImageIds: (ids: FileId[]) => void
  imageIds: FileId[]
  children?: (props: { open: () => void }) => ReactNode
}

const ImageDrawer: React.VFC<Props> = ({
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
          <UiCaption onClick={open}>
            {imageIds.length}
            &nbsp;
            {imageIds.length === 1 ? 'Bild' : 'Bilder'}
          </UiCaption>
        )
      )}</UiDrawer.Trigger>
      <UiDrawer.Body>
        <ImageList
          storeImageIds={storeImageIds}
          imageIds={imageIds}
          modelId={modelId}
          modelName={modelName} />
      </UiDrawer.Body>
    </UiDrawer>
  )
}

export default ImageDrawer
