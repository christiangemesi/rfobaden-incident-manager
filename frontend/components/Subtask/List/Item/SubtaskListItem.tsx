import Subtask, { parseSubtask } from '@/models/Subtask'
import React, { useCallback, useEffect, useState } from 'react'
import { useUser } from '@/stores/UserStore'
import UiListItemWithDetails from '@/components/Ui/List/Item/WithDetails/UiListItemWithDetails'
import { useUsername } from '@/models/User'
import ReactDOM from 'react-dom'
import { DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd'
import styled, { css } from 'styled-components'
import UiCheckbox from '@/components/Ui/Checkbox/UiCheckbox'
import SubtaskStore from '@/stores/SubtaskStore'
import BackendService from '@/services/BackendService'
import SubtaskActions from '@/components/Subtask/Actions/SubtaskActions'
import Task from '@/models/Task'
import UiDescription from '@/components/Ui/Description/UiDescription'
import UiCaptionList from '@/components/Ui/Caption/List/UiCaptionList'
import UiCaption from '@/components/Ui/Caption/UiCaption'
import DocumentImageDrawer from '@/components/Document/Image/Drawer/DocumentImageDrawer'
import DocumentDrawer from '@/components/Document/Drawer/DocumentDrawer'
import Document from '@/models/Document'

interface Props {
  task: Task
  subtask: Subtask,
  provided?: DraggableProvided
  snapshot?: DraggableStateSnapshot
  onClick?: (Subtask: Subtask) => void,
}

const SubtaskListItem: React.VFC<Props> = ({
  task,
  subtask,
  provided = null,
  snapshot = null,
  onClick: handleClick,
}) => {

  const assignee = useUser(subtask.assigneeId)
  const assigneeName = useUsername(assignee)

  const handleChange = useCallback(async () => {
    const isClosed = !subtask.isClosed
    SubtaskStore.save({ ...subtask, isClosed })
    const [newSubtask, error] = await BackendService.update<Subtask>(`incidents/${subtask.incidentId}/reports/${subtask.reportId}/tasks/${subtask.taskId}/subtasks`, subtask.id, {
      ...subtask,
      isClosed,
    })
    if (error !== null) {
      throw error
    }
    SubtaskStore.save(parseSubtask(newSubtask))
  }, [subtask])

  const storeImages = (images: Document[]) => {
    SubtaskStore.save({ ...subtask, images: images })
  }

  const storeDocuments = (documents: Document[]) => {
    SubtaskStore.save({ ...subtask, documents: documents })
  }

  const addImage = useCallback((image: Document) => {
    SubtaskStore.save({ ...subtask, images: [...subtask.images, image]})
  }, [subtask])

  const addDocument = useCallback((document: Document) => {
    SubtaskStore.save({ ...subtask, documents: [...subtask.documents, document]})
  }, [subtask])

  // Delay updates to `isDragging` with a timeout, so the css transitions have time to finish.
  const [isDragging, setDragging] = useState(false)
  useEffect(() => {
    const isSnapshotDragging = snapshot?.isDragging ?? null
    if (isSnapshotDragging !== null) {
      setTimeout(() => {
        setDragging(isSnapshotDragging)
      })
    }
  }, [snapshot?.isDragging])

  const caption = (
    <UiCaptionList>
      <UiCaption isEmphasis>
        Teilauftrag
      </UiCaption>
      <DocumentImageDrawer
        images={subtask.images}
        storeImages={storeImages}
        modelId={subtask.id}
        modelName="subtask"
        onAddImage={addImage}
      />
      <DocumentDrawer
        documents={subtask.documents}
        storeDocuments={storeDocuments}
        modelId={subtask.id}
        modelName="subtask"
        onAddDocument={addDocument}
      />
    </UiCaptionList>
  )

  const child = (
    <div
      ref={provided?.innerRef}
      {...provided?.draggableProps ?? {}}
      {...provided?.dragHandleProps ?? {}}
    >
      <Item
        priority={subtask.priority}
        title={subtask.title}
        user={assigneeName ?? ''}
        isDragging={isDragging && snapshot !== null && !snapshot.isDropAnimating}
        onClick={handleClick && (() => handleClick(subtask))}
        caption={caption}
        body={subtask.description && (
          <UiDescription description={subtask.description} />
        )}
      >
        <SubtaskActions task={task} subtask={subtask} />
        <UiCheckbox label="" value={subtask.isClosed} onChange={handleChange} />
      </Item>
    </div>
  )

  return snapshot !== null && snapshot.isDragging
    ? ReactDOM.createPortal(child, document.body)
    : child
}

export default SubtaskListItem

const Item = styled(UiListItemWithDetails)<{ isDragging: boolean }>`
  margin-bottom: 0.5rem;
  
  transition: 150ms ease-out;
  transition-property: transform;
  
  ${({ isDragging }) => isDragging && css`
      transform: rotate(3deg);
  `}
`