import { Document } from '@/models/FileUpload'
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

interface Props {
  documents: Document[]
  storeDocuments: (documents: Document[]) => void
  modelId: Id<Incident | Report | Task>
  modelName: 'incident' | 'report' | 'task' | 'subtask'
}

const DocumentList: React.VFC<Props> = ({
  documents,
  storeDocuments,
  modelId,
  modelName,
}) => {

  const handleDelete = async (document: Document) => {
    if (confirm('Sind sie sicher, dass sie das Dokument löschen wollen?')) {
      const error = await BackendService.delete('documents', document.id, {
        modelName: modelName,
        modelId: modelId.toString(),
      })
      if (error !== null) {
        throw error
      }
      documents = documents.filter((d) => d !== document)
      storeDocuments(documents)
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
          <UiTitle level={6}>Erweiterung</UiTitle>
        </UiGrid.Col>
      </UiGrid>
      <UiList>
        {documents.map((document) => (
          <DocumentListItem
            key={document.id}
            document={document}
            onDelete={handleDelete}
          />
        ))}
      </UiList>
    </div>
  )
}

export default DocumentList
