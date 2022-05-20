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
import useSort from '@/utils/hooks/useSort'
import UiSortButton from '@/components/Ui/Button/UiSortButton'

interface Props {
  /**
   * The {@link Document documents} to be displayed.
   */
  documents: Document[]

  /**
   * Event caused by deleting a {@link Document}.
   * This will store the manipulated list of {@link Document documents} in the corresponding {@link Store}.
   */
  storeDocuments: (documents: Document[]) => void

  /**
   * The {@link Id} of the corresponding {@link Model}.
   */
  modelId: Id<Incident | Report | Task>

  /**
   * The name of the corresponding {@link Model}.
   */
  modelName: 'incident' | 'report' | 'task' | 'subtask'

  /**
   * Event caused by adding a new {@link Document}.
   */
  onAddDocument: (documents: Document) => void
}

/**
 * `DocumentList` is a component to display {@link DocumentListItem DocumentListItems}
 * in a {@link UiList}.
 */
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

  const [sortedDocuments, sort] = useSort(documents, () => ({
    name: String,
    extension: String,
  }))

  return (
    <React.Fragment>
      <UiTitle level={2}>
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
      <UiGrid gapH={0.5}>
        <UiGrid.Col>
          <UiSortButton field={sort.name}>
            <UiTitle level={6}>Name</UiTitle>
          </UiSortButton>
        </UiGrid.Col>
        <UiGrid.Col>
          <UiSortButton field={sort.extension}>
            <UiTitle level={6}>Erweiterung</UiTitle>
          </UiSortButton>
        </UiGrid.Col>
      </UiGrid>
      <UiList>
        {sortedDocuments.map((document) => (
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