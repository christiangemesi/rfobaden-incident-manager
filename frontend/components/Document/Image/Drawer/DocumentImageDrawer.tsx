import UiDrawer from '@/components/Ui/Drawer/UiDrawer'
import React from 'react'
import Document from '@/models/Document'
import UiCaption from '@/components/Ui/Caption/UiCaption'
import DocumentImageList from '@/components/Document/Image/List/DocumentImageList'
import Id from '@/models/base/Id'
import Incident from '@/models/Incident'
import Report from '@/models/Report'
import Task from '@/models/Task'
import Subtask from '@/models/Subtask'

interface Props {
  /**
   * The {@link Document images} to be displayed.
   */
  images: Document[]

  /**
   * Event caused by deleting a {@link Document image}.
   * This will store the manipulated list of {@link Document images} in the corresponding {@link Store}.
   */
  storeImages: (images: Document[]) => void

  /**
   * The {@link Id} of the corresponding {@link Model}.
   */
  modelId: Id<Incident | Report | Task | Subtask>

  /**
   * The name of the corresponding {@link Model}.
   */
  modelName: 'incident' | 'report' | 'task' | 'subtask'

  /**
   * Event caused by adding a new {@link Document image}.
   */
  onAddImage: (image: Document) => void
}

/**
 * `DocumentImageDrawer` is a component which uses a {@link @UiDrawer} to display {@link Document images}.
 * The `DocumentImageDrawer` is opening by clicking on a {@link UiCaption}.
 */
const DocumentImageDrawer: React.VFC<Props> = ({
  images,
  storeImages,
  modelId,
  modelName,
  onAddImage,
}) => {

  return (
    <UiDrawer size="full">
      <UiDrawer.Trigger>{({ open }) => (
        <UiCaption onClick={open}>
          {images.length}
          &nbsp;
          {images.length === 1 ? 'Bild' : 'Bilder'}
        </UiCaption>
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