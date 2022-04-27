import Task from '@/models/Task'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import TaskInfo from '@/components/Task/Info/TaskInfo'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UiIconButtonGroup from '@/components/Ui/Icon/Button/Group/UiIconButtonGroup'
import TaskActions from '@/components/Task/Actions/TaskActions'
import UiIconButton from '@/components/Ui/Icon/Button/UiIconButton'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiDescription from '@/components/Ui/Description/UiDescription'
import React from 'react'
import Report from '@/models/Report'

interface Props {
  report: Report
  task: Task
  onClose?: () => void
}

const TaskViewHeader: React.VFC<Props> = ({ report, task, onClose: handleClose }) => {
  return (
    <React.Fragment>
      <UiGrid justify="space-between" align="start" gap={1} style={{ flexWrap: 'nowrap' }}>
        <div>
          <TaskInfo task={task} />
          <UiTitle level={4}>
            {task.title}
          </UiTitle>
        </div>

        <UiIconButtonGroup>
          <TaskActions report={report} task={task} />

          <UiIconButton onClick={handleClose}>
            <UiIcon.CancelAction />
          </UiIconButton>
        </UiIconButtonGroup>
      </UiGrid>

      <UiDescription description={task.description} />
    </React.Fragment>
  )
}
export default TaskViewHeader
