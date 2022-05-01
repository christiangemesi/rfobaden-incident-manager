import React from 'react'
import UiDateLabel from '@/components/Ui/DateLabel/UiDateLabel'
import UiCaptionList from '@/components/Ui/Caption/List/UiCaptionList'
import { useUsername } from '@/models/User'
import { useUser } from '@/stores/UserStore'
import UiCaption from '@/components/Ui/Caption/UiCaption'
import Task from '@/models/Task'
import { FileId } from '@/models/FileUpload'
import TaskStore from '@/stores/TaskStore'
import ImageDrawer from '@/components/Image/Drawer/ImageDrawer'
import DocumentDrawer from '@/components/Document/Drawer/DocumentDrawer'

interface Props {
  task: Task
}

const TaskInfo: React.VFC<Props> = ({ task }) => {
  const assigneeName = useUsername(useUser(task.assigneeId))

  const storeImageIds = (ids: FileId[]) => {
    TaskStore.save({ ...task, imageIds: ids })
  }

  const storeDocumentIds = (ids: FileId[]) => {
    TaskStore.save({ ...task, documentIds: ids })
  }

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
      <ImageDrawer
        modelId={task.id}
        modelName="task"
        storeImageIds={storeImageIds}
        imageIds={task.imageIds}
      />
      <DocumentDrawer
        modelId={task.id}
        modelName="task"
        storeDocumentIds={storeDocumentIds}
        documentIds={task.documentIds}
      />
    </UiCaptionList>
  )
}
export default TaskInfo
