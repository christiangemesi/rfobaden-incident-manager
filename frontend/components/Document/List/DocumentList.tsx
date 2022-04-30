import { FileId, getDocumentUrl } from '@/models/FileUpload'
import React from 'react'
import BackendService from '@/services/BackendService'
import Id from '@/models/base/Id'
import Incident from '@/models/Incident'
import Report from '@/models/Report'
import Task from '@/models/Task'
import UiTitle from '@/components/Ui/Title/UiTitle'
import DocumentItem from '@/components/Document/Item/DocumentItem'
import UiList from '@/components/Ui/List/UiList'
import UiGrid from '@/components/Ui/Grid/UiGrid'

interface Props {
  fileIds: FileId[]
  modelId: Id<Incident | Report | Task>
  modelName: 'incident' | 'report' | 'task' | 'subtask'
  storeFileIds: (ids: FileId[]) => void
}

const DocumentList: React.VFC<Props> = ({
  fileIds,
  modelId,
  modelName,
  storeFileIds,
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
          <DocumentItem
            key={id}
            src={getDocumentUrl(id)}
            id={id}
            onDelete={handleDelete}
          />
        ))}
      </UiList>
    </div>
  )
}

export default DocumentList
