import { Document } from '@/models/FileUpload'
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

interface Props {
  images: Document[]
  modelId: Id<Incident | Report | Task>
  modelName: 'incident' | 'report' | 'task' | 'subtask'
  storeImages: (images: Document[]) => void
}

const DocumentImageList: React.VFC<Props> = ({ 
  images, 
  modelId, 
  modelName, 
  storeImages,
}) => {

  const handleDelete = async (image: Document) => {
    if (confirm('Sind sie sicher, dass sie das Bild löschen wollen?')) {
      const error = await BackendService.delete('images', image.id, {
        modelName: modelName,
        modelId: modelId.toString(),
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
      <UiTitle level={1}>
        Bilder
      </UiTitle>
      <ImageContainer>
        {images.length > 0
          ? images.map((image) => (
            <DocumentImageItem
              key={image.id}
              image={image}
              onDelete={handleDelete} />
          ))
          : <p>Keine gespeicherten Bilder</p>
        }
      </ImageContainer>
    </UiContainer>
  )
}

export default DocumentImageList

const ImageContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.7rem;
`