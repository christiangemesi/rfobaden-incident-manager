import Task from '@/models/Task'
import React, { useCallback } from 'react'
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
import UiIconButton from '@/components/Ui/Icon/Button/UiIconButton'
import UiModal from '@/components/Ui/Modal/UiModal'
import TaskForm from '@/components/Task/Form/TaskForm'
import UiDropDown from '@/components/Ui/DropDown/UiDropDown'
import TaskStore from '@/stores/TaskStore'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import { router } from 'next/client'
import { useRouter } from 'next/router'

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

  const router = useRouter()
  const handleDelete = useCallback(async () => {
    if (confirm(`Sind sie sicher, dass sie den Auftrag "${task.title}" schliessen wollen?`)) {
      await BackendService.delete(`incidents/${task.incidentId}/reports/${task.reportId}/tasks`, task.id)
      await router.push({ pathname: `/ereignisse/${task.incidentId}`, query: { report: task.reportId }})
      TaskStore.remove(task.id)
    }
  }, [task, router])

  return (
    <div>
      <UiGrid justify="space-between" align="center">
        <UiTitle level={4}>
          {task.title}
        </UiTitle>

        <UiDropDown>
          <UiDropDown.Trigger>
            <UiIconButton>
              <UiIcon.More />
            </UiIconButton>
          </UiDropDown.Trigger>
          <UiModal isFull>
            <UiModal.Activator>{({ open }) => (
              <UiDropDown.Item onClick={open}>
                Bearbeiten
              </UiDropDown.Item>
            )}</UiModal.Activator>
            <UiModal.Body>{({ close }) => (
              <React.Fragment>
                <UiTitle level={1} isCentered>
                  Task bearbeiten
                </UiTitle>
                <TaskForm incident={incident} report={report} task={task} onClose={close} />
              </React.Fragment>
            )}</UiModal.Body>
          </UiModal>
          <UiDropDown.Item onClick={handleDelete}>
            Löschen
          </UiDropDown.Item>
        </UiDropDown>
      </UiGrid>

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