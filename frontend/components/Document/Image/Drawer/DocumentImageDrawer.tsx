import UiDrawer from '@/components/Ui/Drawer/UiDrawer'
import React, { ReactNode } from 'react'
import Document from '@/models/Document'
import UiCaption from '@/components/Ui/Caption/UiCaption'
import DocumentImageList from '@/components/Document/Image/List/DocumentImageList'

interface Props {
  images: Document[]
  storeImages: (images: Document[]) => void
  modelId: number
  modelName: 'incident' | 'report' | 'task' | 'subtask'
  children?: (props: { open: () => void }) => ReactNode
  onAddImage: (image: Document) => void
}

const DocumentImageDrawer: React.VFC<Props> = ({
  images,
  storeImages,
  modelId,
  modelName,
  children,
  onAddImage,
}) => {

  return (
    <UiDrawer size="full" align="top">
      <UiDrawer.Trigger>{({ open }) => (
        children ? children({ open }) : (
          <UiCaption onClick={ open }>
            {images.length}
            &nbsp;
            {images.length === 1 ? 'Bild' : 'Bilder'}
          </UiCaption>
        )
      )}</UiDrawer.Trigger>
      <UiDrawer.Body>
        <DocumentImageList
          images={images}
          storeImages={storeImages}
          modelId={modelId}
          modelName={modelName}
          onAddImage={onAddImage}
        />
      </UiDrawer.Body>
    </UiDrawer>
  )
}

export default DocumentImageDrawer