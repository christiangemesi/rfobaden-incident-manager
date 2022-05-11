import UiDrawer from '@/components/Ui/Drawer/UiDrawer'
import React, { ReactNode } from 'react'
import { Document } from '@/models/FileUpload'
import UiCaption from '@/components/Ui/Caption/UiCaption'
import DocumentImageList from '@/components/Document/Image/List/DocumentImageList'
import styled from 'styled-components'

interface Props {
  images: Document[]
  storeImages: (images: Document[]) => void
  modelId: number
  modelName: 'incident' | 'report' | 'task' | 'subtask'
  children?: (props: { open: () => void }) => ReactNode
  onAddDocument: (document: Document) => void
}

const DocumentImageDrawer: React.VFC<Props> = ({
  images,
  storeImages,
  modelId,
  modelName,
  children,
  onAddDocument,
}) => {

  return (
    <UiDrawer size="full">
      <UiDrawer.Trigger>{({ open }) => (
        children ? children({ open }) : (
          <Caption onClick={ open }>
            {images.length}
            &nbsp;
            {images.length === 1 ? 'Bild' : 'Bilder'}
          </Caption>
        )
      )}</UiDrawer.Trigger>
      <UiDrawer.Body>
        <DocumentImageList
          images={images}
          storeImages={storeImages}
          modelId={modelId}
          modelName={modelName}
          onAddDocument={onAddDocument}
        />
      </UiDrawer.Body>
    </UiDrawer>
  )
}

export default DocumentImageDrawer

const Caption = styled(UiCaption)`
  transition: ease 100ms;
  transition-property: transform;
  :hover {
    transform: scale(1.1);
  }
`