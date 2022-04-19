import React from 'react'
import UiDateLabel from '@/components/Ui/DateLabel/UiDateLabel'
import UiCaptionList from '@/components/Ui/Caption/List/UiCaptionList'
import { useUsername } from '@/models/User'
import { useUser } from '@/stores/UserStore'
import UiCaption from '@/components/Ui/Caption/UiCaption'
import Task from '@/models/Task'
import { FileId } from '@/models/FileUpload'
import TaskStore from '@/stores/TaskStore'
import UiDrawer from '@/components/Ui/Drawer/UiDrawer'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UiImageList from '@/components/Ui/Image/List/UiImageList'

interface Props {
  task: Task
}

const TaskInfo: React.VFC<Props> = ({ task }) => {
  const assigneeName = useUsername(useUser(task.assigneeId))

  const storeImageIds = (ids: FileId[]) => {
    TaskStore.save({ ...task, imageIds: ids })
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

      <UiDrawer size="full">
        <UiDrawer.Trigger>{({ open }) => (
          <UiCaption onClick={open}>
            {task.imageIds.length}
            &nbsp;
            {task.imageIds.length === 1 ? 'Bild' : 'Bilder'}
          </UiCaption>
        )}</UiDrawer.Trigger>
        <UiDrawer.Body>
          <UiTitle level={1}>
            Bilder
          </UiTitle>
          <UiImageList
            storeImageIds={storeImageIds}
            imageIds={task.imageIds}
            modelId={task.id}
            modelName="task" />
        </UiDrawer.Body>
      </UiDrawer>
    </UiCaptionList>
  )
}
export default TaskInfo
