import UiImage from '@/components/Ui/Image/UiImage'
import { FileId, getImageUrl } from '@/models/FileUpload'
import React from 'react'
import styled from 'styled-components'
import BackendService from '@/services/BackendService'
import Id from '@/models/base/Id'
import Incident from '@/models/Incident'
import Report from '@/models/Report'
import Task from '@/models/Task'

interface Props {
  imageIds: number[]
  modelId: Id<Incident | Report | Task>
  modelName: 'incident' | 'report' | 'task' | 'subtask'
}

const UiImageList: React.VFC<Props> = ({ imageIds, modelId, modelName }) => {

  const onDeleteImage = async ( id: FileId) => {
    if (confirm('Sind sie sicher, dass sie das Bild löschen wollen?')) {

      const error = await BackendService.delete('images', id, {
        modelName: modelName,
        modelId: modelId.toString(),
      })
      if (error !== null) {
        throw error
      }
    }
  }

  return (
    <ImageContainer>
      {imageIds.map((imageId) => (
        <UiImage
          key={imageId}
          src={getImageUrl(imageId)}
          text="Filename"
          id={imageId}
          onDelete={onDeleteImage} />
      ))}
    </ImageContainer>
  )
}

export default UiImageList

const ImageContainer = styled.div`
  display: flex;
  align-items: start;
  gap: 0.7rem;
`