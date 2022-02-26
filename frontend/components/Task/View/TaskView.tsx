import Task from '@/models/Task'
import React from 'react'
import UiTitle from '@/components/Ui/Title/UiTitle'
import SubtaskList from '@/components/Subtask/List/SubtaskList'
import { useIncident } from '@/stores/IncidentStore'
import { useReport } from '@/stores/ReportStore'
import SubtaskStore, { useSubtasksOfTask } from '@/stores/SubtaskStore'
import Id from '@/models/base/Id'
import { useAsync } from 'react-use'
import BackendService, { BackendResponse } from '@/services/BackendService'
import Subtask, { parseSubtask } from '@/models/Subtask'
import UiIcon from '@/components/Ui/Icon/UiIcon'

interface Props {
  task: Task
}

const TaskView: React.VFC<Props> = ({ task }) => {
  const incident = useIncident(task.incidentId)
  if (incident === null) {
    throw new Error('incident is missing')
  }

  const report = useReport(task.reportId)
  if (report === null) {
    throw new Error('report is missing')
  }

  const subtasks = useSubtasksOfTask(task.id)
  const { loading: isLoading } = useAsync(async () => {
    if (loadedTasks.has(task.id)) {
      return
    }
    const [subtasks, error]: BackendResponse<Subtask[]> = await BackendService.list(
      `incidents/${report.incidentId}/reports/${report.id}/tasks/${task.id}/subtasks`,
    )
    if (error !== null) {
      throw error
    }
    SubtaskStore.saveAll(subtasks.map(parseSubtask))
    loadedTasks.add(task.id)
  }, [report.id])

  return (
    <div>
      <UiTitle level={4}>
        {task.title}
      </UiTitle>

      <div>
        {isLoading ? (
          <UiIcon.Loader isSpinner />
        ) : (
          <SubtaskList incident={incident} report={report} task={task} subtasks={subtasks} activeSubtask={null} />
        )}
      </div>
    </div>
  )
}
export default TaskView

const loadedTasks = new Set<Id<Task>>()