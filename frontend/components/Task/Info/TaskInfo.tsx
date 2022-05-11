import React, { useCallback } from 'react'
import UiDateLabel from '@/components/Ui/DateLabel/UiDateLabel'
import UiCaptionList from '@/components/Ui/Caption/List/UiCaptionList'
import { useUsername } from '@/models/User'
import { useUser } from '@/stores/UserStore'
import UiCaption from '@/components/Ui/Caption/UiCaption'
import Task from '@/models/Task'
import { Document } from '@/models/FileUpload'
import TaskStore from '@/stores/TaskStore'
import DocumentImageDrawer from '@/components/Document/Image/Drawer/DocumentImageDrawer'
import DocumentDrawer from '@/components/Document/Drawer/DocumentDrawer'

interface Props {
  task: Task
}

const TaskInfo: React.VFC<Props> = ({ task }) => {
  const assigneeName = useUsername(useUser(task.assigneeId))

  const storeImages = (images: Document[]) => {
    TaskStore.save({ ...task, images: images })
  }

  const storeDocuments = (documents: Document[]) => {
    TaskStore.save({ ...task, documents: documents })
  }

  const addImage = useCallback((image: Document) => {
    TaskStore.save({ ...task, images: [...task.images, image]})
  }, [task])

  const addDocument = useCallback((document: Document) => {
    TaskStore.save({ ...task, documents: [...task.documents, document]})
  }, [task])

  return (
    <UiCaptionList>
      <UiCaption isEmphasis>
        Auftrag
      </UiCaption>
      {task.location && (
        <UiCaption>
          {task.location}
        </UiCaption>
      )}
      {assigneeName && (
        <UiCaption>
          {assigneeName}
        </UiCaption>
      )}
      <UiCaption>
        <UiDateLabel start={task.startsAt ?? task.createdAt} end={task.endsAt} />
      </UiCaption>
      <DocumentImageDrawer
        images={task.images}
        storeImages={storeImages}
        modelId={task.id}
        modelName="task"
        onAddImage={addImage}
      />
      <DocumentDrawer
        documents={task.documents}
        storeDocuments={storeDocuments}
        modelId={task.id}
        modelName="task"
        onAddDocument={addDocument}
      />
    </UiCaptionList>
  )
}
export default TaskInfo
