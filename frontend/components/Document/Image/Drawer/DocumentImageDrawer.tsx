import UiDrawer from '@/components/Ui/Drawer/UiDrawer'
import React, { ReactNode } from 'react'
import { FileId } from '@/models/FileUpload'
import UiCaption from '@/components/Ui/Caption/UiCaption'
import DocumentImageList from '@/components/Document/Image/List/DocumentImageList'
import styled from 'styled-components'

interface Props {
  modelId: number
  modelName: 'incident' | 'report' | 'task' | 'subtask'
  storeImageIds: (ids: FileId[]) => void
  imageIds: FileId[]
  children?: (props: { open: () => void }) => ReactNode
  onAddFile: (fileId: FileId) => void
}

const DocumentImageDrawer: React.VFC<Props> = ({
  imageIds,
  modelId,
  modelName,
  storeImageIds,
  children,
  onAddFile,
}) => {

  return (
    <UiDrawer size="full">
      <UiDrawer.Trigger>{({ open }) => (
        children ? children({ open }) : (
          <Caption onClick={ open }>
            {imageIds.length}
            &nbsp;
            {imageIds.length === 1 ? 'Bild' : 'Bilder'}
          </Caption>
        )
      )}</UiDrawer.Trigger>
      <UiDrawer.Body>
        <DocumentImageList
          storeImageIds={storeImageIds}
          imageIds={imageIds}
          modelId={modelId}
          modelName={modelName}
          onAddFile={onAddFile}
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