import React from 'react'
import styled from 'styled-components'
import BackendService from '@/services/BackendService'
import Id from '@/models/base/Id'
import Incident from '@/models/Incident'
import Report from '@/models/Report'
import Task from '@/models/Task'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UiContainer from '@/components/Ui/Container/UiContainer'
import DocumentImageItem from '@/components/Document/Image/List/Item/DocumentImageItem'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiCreateButton from '@/components/Ui/Button/UiCreateButton'
import UiModal from '@/components/Ui/Modal/UiModal'
import DocumentForm from '@/components/Document/Form/DocumentForm'
import Document from '@/models/Document'

interface Props {
  /**
   * The {@link Document images} to be displayed.
   */
  images: Document[]

  /**
   * Event caused by deleting an {@link Document image}.
   * This will store the manipulated list of {@link Document images} in the corresponding {@link Store}.
   */
  storeImages: (images: Document[]) => void

  /**
   * The {@link Id} of the corresponding {@link Model}.
   */
  modelId: Id<Incident | Report | Task>

  /**
   * The name of the corresponding {@link Model}.
   */
  modelName: 'incident' | 'report' | 'task' | 'subtask'

  /**
   * Event caused by adding a new {@link Document}.
   */
  onAddImage: (image: Document) => void
}

/**
 * `DocumentImageList` is a component to display {@link DocumentListItem DocumentImageItems}
 * in a list.
 */
const DocumentImageList: React.VFC<Props> = ({
  images,
  storeImages,
  modelId,
  modelName,
  onAddImage,
}) => {

  const handleDelete = async (image: Document) => {
    if (confirm('Sind sie sicher, dass sie das Bild löschen wollen?')) {
      const error = await BackendService.delete('documents', image.id, {
        modelName: modelName,
        modelId: modelId.toString(),
        type: 'image',
      })
      if (error !== null) {
        throw error
      }
      images = images.filter((i) => i !== image)
      storeImages(images)
    }
  }

  return (
    <UiContainer>
      <UiTitle level={2}>
        Bilder
      </UiTitle>
      <ImageContainer>
        <UiModal title="Bild hinzufügen" size="fixed">
          <UiModal.Trigger>{({ open }) => (
            <Button onClick={open}>
              <UiIcon.CreateAction size={2} />
            </Button>
          )}</UiModal.Trigger>
          <UiModal.Body>{({ close }) => (
            <DocumentForm
              modelId={modelId}
              modelName={modelName}
              type="image"
              onSave={onAddImage}
              onClose={close}
            />
          )}</UiModal.Body>
        </UiModal>
        {images.map((image) => (
          <DocumentImageItem
            key={image.id}
            image={image}
            onDelete={handleDelete} />
        ))}
      </ImageContainer>
    </UiContainer>
  )
}

export default DocumentImageList

const ImageContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-top: 1rem;
`
const Button = styled(UiCreateButton)`
  position: relative;
  max-width: 12rem;
  border-radius: 0;
  width: 200px;
  min-height: 235px;
  height: inherit;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
`