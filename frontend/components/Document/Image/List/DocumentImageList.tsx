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
import UiDrawer from '@/components/Ui/Drawer/UiDrawer'
import DocumentForm from '@/components/Document/Form/DocumentForm'
import Document from '@/models/Document'

interface Props {
  images: Document[]
  storeImages: (images: Document[]) => void
  modelId: Id<Incident | Report | Task>
  modelName: 'incident' | 'report' | 'task' | 'subtask'
  onAddImage: (image: Document) => void
}

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
        <UiDrawer title="Bild hinzufügen" size="fixed">
          <UiDrawer.Trigger>{({ open }) => (
            <Button onClick={open}>
              <UiIcon.CreateAction size={2} />
            </Button>
          )}</UiDrawer.Trigger>
          <UiDrawer.Body>{({ close }) => (
            <DocumentForm
              modelId={modelId}
              modelName={modelName}
              type="image"
              onSave={onAddImage}
              onClose={close}
            />
          )}</UiDrawer.Body>
        </UiDrawer>
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