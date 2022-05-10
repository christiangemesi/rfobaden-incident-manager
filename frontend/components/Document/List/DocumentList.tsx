import { FileId } from '@/models/FileUpload'
import React from 'react'
import BackendService from '@/services/BackendService'
import Id from '@/models/base/Id'
import Incident from '@/models/Incident'
import Report from '@/models/Report'
import Task from '@/models/Task'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UiList from '@/components/Ui/List/UiList'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import DocumentListItem from '@/components/Document/List/Item/DocumentListItem'
import UiModal from '@/components/Ui/Modal/UiModal'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import DocumentForm from '@/components/Document/Form/DocumentForm'
import styled from 'styled-components'
import UiCreateButton from '@/components/Ui/Button/UiCreateButton'

interface Props {
  fileIds: FileId[]
  modelId: Id<Incident | Report | Task>
  modelName: 'incident' | 'report' | 'task' | 'subtask'
  storeFileIds: (ids: FileId[]) => void
  onAddFile: (fileId: FileId) => void
}

const DocumentList: React.VFC<Props> = ({
  fileIds,
  modelId,
  modelName,
  storeFileIds,
  onAddFile,
}) => {

  const handleDelete = async (id: FileId) => {
    if (confirm('Sind sie sicher, dass sie das Dokument löschen wollen?')) {
      const error = await BackendService.delete('documents', id, {
        modelName: modelName,
        modelId: modelId.toString(),
      })
      if (error !== null) {
        throw error
      }
      fileIds = fileIds.filter((i) => i !== id)
      storeFileIds(fileIds)
    }
  }

  return (
    <div>
      <UiTitle level={1}>
        Dokumente
      </UiTitle>
      <UiModal title="Dokument hinzufügen" size="fixed">
        <UiModal.Trigger>{({ open }) => (
          <Button onClick={open}>
            <UiIcon.CreateAction size={1.5} />
          </Button>
        )}</UiModal.Trigger>
        <UiModal.Body>{({ close }) => (
          <DocumentForm
            modelId={modelId}
            modelName={modelName}
            onSave={onAddFile}
            onClose={close}
          />
        )}</UiModal.Body>
      </UiModal>
      <UiGrid style={{ padding: '0 0.5rem' }} gapH={0.5}>

        <UiGrid.Col size={8}>
          <UiTitle level={6}>Name</UiTitle>
        </UiGrid.Col>
        <UiGrid.Col size={3}>
          <UiTitle level={6}>Typ</UiTitle>
        </UiGrid.Col>
      </UiGrid>
      <UiList>
        {fileIds.map((id) => (
          <DocumentListItem
            key={id}
            id={id}
            onDelete={handleDelete}
          />
        ))}
      </UiList>
    </div>
  )
}

export default DocumentList

const Button = styled(UiCreateButton)`
  position: relative;
  font-size: 120%;
  margin: 1rem 0;
`