import React from 'react'
import styled from 'styled-components'
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
import DocumentForm from '@/components/Document/Form/DocumentForm'
import Document from '@/models/Document'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiCreateButton from '@/components/Ui/Button/UiCreateButton'

interface Props {
  documents: Document[]
  storeDocuments: (documents: Document[]) => void
  modelId: Id<Incident | Report | Task>
  modelName: 'incident' | 'report' | 'task' | 'subtask'
  onAddDocument: (documents: Document) => void
}

const DocumentList: React.VFC<Props> = ({
  documents,
  storeDocuments,
  modelId,
  modelName,
  onAddDocument,
}) => {

  const handleDelete = async (document: Document) => {
    if (confirm('Sind sie sicher, dass sie das Dokument löschen wollen?')) {
      const error = await BackendService.delete('documents', document.id, {
        modelName: modelName,
        modelId: modelId.toString(),
        type: 'document',
      })
      if (error !== null) {
        throw error
      }
      documents = documents.filter((d) => d !== document)
      storeDocuments(documents)
    }
  }

  return (
    <React.Fragment>
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
            onSave={onAddDocument}
            onClose={close}
            type="document"
          />
        )}</UiModal.Body>
      </UiModal>
      <UiGrid style={{ padding: '0.5rem' }} gapH={0.5}>
        <UiGrid.Col size={7}>
          <UiTitle level={6}>Name</UiTitle>
        </UiGrid.Col>
        <UiGrid.Col>
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
    </React.Fragment>
  )
}

export default DocumentList

const Button = styled(UiCreateButton)`
  position: relative;
  font-size: 120%;
  margin: 1rem 0;
`