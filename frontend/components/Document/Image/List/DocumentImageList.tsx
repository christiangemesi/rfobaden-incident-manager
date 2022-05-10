import { FileId, getImageUrl } from '@/models/FileUpload'
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

interface Props {
  imageIds: FileId[]
  modelId: Id<Incident | Report | Task>
  modelName: 'incident' | 'report' | 'task' | 'subtask'
  storeImageIds: (ids: FileId[]) => void
  onAddFile: (fileId: FileId) => void
}

const DocumentImageList: React.VFC<Props> = ({
  imageIds,
  modelId,
  modelName,
  storeImageIds,
  onAddFile,
}) => {

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
              onSave={onAddFile}
              onClose={close}
            />
          )}</UiModal.Body>
        </UiModal>
        {imageIds.map((id) => (
          <DocumentImageItem
            key={id}
            src={getImageUrl(id)}
            text="Filename"
            id={id}
            onDelete={handleDelete}
          />
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
`
const Button = styled(UiCreateButton)`
  position: relative;
  max-width: 12rem;
  border-radius: 0;
  width: 200px;
  min-height: 235px;
  height: inherit;
`