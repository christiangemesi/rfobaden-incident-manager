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

interface Props {
  imageIds: FileId[]
  modelId: Id<Incident | Report | Task>
  modelName: 'incident' | 'report' | 'task' | 'subtask'
  storeImageIds: (ids: FileId[]) => void
}

const UiImageList: React.VFC<Props> = ({ imageIds, modelId, modelName, storeImageIds }) => {

  const [ids, setIds] = useState<FileId[]>(imageIds)

  const handleDelete = async (id: FileId) => {
    if (confirm('Sind sie sicher, dass sie das Bild löschen wollen?')) {

      const error = await BackendService.delete('images', id, {
        modelName: modelName,
        modelId: modelId.toString(),
      })
      if (error !== null) {
        throw error
      }
      const remainingIds = ids.filter((i) => i !== id)
      setIds(remainingIds)
      storeImageIds(remainingIds)
    }
  }

  return (
    <div>
      <UiTitle level={1}>
        Bilder
      </UiTitle>
      <ImageContainer>
        {imageIds.length > 0 ?
          ids.map((imageId) => (
            <UiImage
              key={imageId}
              src={getImageUrl(imageId)}
              text="Filename"
              id={imageId}
              onDelete={handleDelete} />
          ))
          : <p>Keine gespeicherten Bilder</p>
        }
      </ImageContainer>
    </div>
  )
}

export default UiImageList

const ImageContainer = styled.div`
  display: flex;
  align-items: start;
  gap: 0.7rem;
`