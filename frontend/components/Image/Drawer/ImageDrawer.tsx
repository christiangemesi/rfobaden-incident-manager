import UiDrawer from '@/components/Ui/Drawer/UiDrawer'
import ImageList from '@/components/Image/List/ImageList'
import React, { ReactNode } from 'react'
import { FileId } from '@/models/FileUpload'
import styled, { css } from 'styled-components'

interface Props {
  modelId: number
  modelName: 'incident' | 'report' | 'task' | 'subtask'
  storeImageIds: (ids: FileId[]) => void
  imageIds: FileId[]
  children: ReactNode
}

const ImageDrawer: React.VFC<Props> = ({
  imageIds,
  modelId,
  modelName,
  storeImageIds,
  children,
}) => {

  const isEmptyList = imageIds.length > 0

  return (
    <UiDrawer size="full">
      <UiDrawer.Trigger>{({ open }) => (
        <Content
          onClick={isEmptyList ? open : undefined}
          isClickable={isEmptyList}
        >
          {children}
        </Content>
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

const Content = styled.div<{ isClickable: boolean }>`
  ${({ isClickable }) => isClickable && css`
    :hover {
      cursor: pointer
    }
  `}
`