import UiImage from '@/components/Ui/Image/UiImage'
import { FileId, getImageUrl } from '@/models/FileUpload'
import React, { useState } from 'react'
import styled from 'styled-components'
import BackendService from '@/services/BackendService'
import Id from '@/models/base/Id'
import Incident from '@/models/Incident'
import Report from '@/models/Report'
import Task from '@/models/Task'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UiContainer from '@/components/Ui/Container/UiContainer'

interface Props {
  imageIds: FileId[]
  modelId: Id<Incident | Report | Task>
  modelName: 'incident' | 'report' | 'task' | 'subtask'
  storeImageIds: (ids: FileId[]) => void
}

const UiImageList: React.VFC<Props> = ({ imageIds, modelId, modelName, storeImageIds }) => {

  const handleDelete = async (id: FileId) => {
    if (confirm('Sind sie sicher, dass sie das Bild löschen wollen?')) {

      const error = await BackendService.delete('images', id, {
        modelName: modelName,
        modelId: modelId.toString(),
      })
      if (error !== null) {
        throw error
      }
      imageIds = imageIds.filter((i) => i !== id)
      storeImageIds(imageIds)
    }
  }

  return (
    <UiContainer>
      <UiTitle level={1}>
        Bilder
      </UiTitle>
      <ImageContainer>
        {imageIds.length > 0
          ? imageIds.map((id) => (
            <UiImage
              key={id}
              src={getImageUrl(id)}
              text="Filename"
              id={id}
              onDelete={handleDelete} />
          ))
          : <p>Keine gespeicherten Bilder</p>
        }
      </ImageContainer>
    </UiContainer>
  )
}

export default UiImageList

const ImageContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.7rem;
`