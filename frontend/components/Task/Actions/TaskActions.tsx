import Report from '@/models/Report'
import Task, { parseTask } from '@/models/Task'
import React, { useCallback } from 'react'
import UiDropDown from '@/components/Ui/DropDown/UiDropDown'
import UiIconButton from '@/components/Ui/Icon/Button/UiIconButton'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiModal from '@/components/Ui/Modal/UiModal'
import UiTitle from '@/components/Ui/Title/UiTitle'
import SubtaskForm from '@/components/Subtask/Form/SubtaskForm'
import TaskForm from '@/components/Task/Form/TaskForm'
import BackendService, { BackendResponse } from '@/services/BackendService'
import TaskStore from '@/stores/TaskStore'

interface Props {
  report: Report
  task: Task
  onDelete?: () => void
}

const TaskActions: React.VFC<Props> = ({ report, task, onDelete: handleDeleteCb }) => {
  const handleDelete = useCallback(async () => {
    if (confirm(`Sind sie sicher, dass sie den Auftrag "${task.title}" schliessen wollen?`)) {
      await BackendService.delete(`incidents/${task.incidentId}/reports/${task.reportId}/tasks`, task.id)
      TaskStore.remove(task.id)
      if (handleDeleteCb) {
        handleDeleteCb()
      }
    }
  }, [task, handleDeleteCb])

  const handleClose = useCallback(async () => {
    if (task.isDone) {
      alert('Es sind alle Teilaufträge geschlossen.')
      return
    }
    if (confirm(`Sind sie sicher, dass sie den Auftrag "${task.title}" schliessen wollen?`)) {
      const newTask = { ...task, isClosed: true }
      const [data, error]: BackendResponse<Task> = await BackendService.update(`incidents/${task.incidentId}/reports/${task.reportId}/tasks`, task.id, newTask)
      if (error !== null) {
        throw error
      }
      TaskStore.save(parseTask(data))
    }
  }, [task])

  const handleReopen = useCallback(async () => {
    if (task.isDone) {
      alert('Es sind alle Teilaufträge geschlossen.')
      return
    }
    if (confirm(`Sind sie sicher, dass sie den Auftrag "${task.title}" öffnen wollen?`)) {
      const newTask = { ...task, isClosed: false }
      const [data, error]: BackendResponse<Task> = await BackendService.update(`incidents/${task.incidentId}/reports/${task.reportId}/tasks`, task.id, newTask)
      if (error !== null) {
        throw error
      }
      TaskStore.save(parseTask(data))
    }
  }, [task])

  return (
    <UiDropDown>
      <UiDropDown.Trigger>{({ toggle }) => (
        <UiIconButton onClick={toggle}>
          <UiIcon.More />
        </UiIconButton>
      )}</UiDropDown.Trigger>
      <UiDropDown.Menu>
        <UiModal isFull>
          <UiModal.Activator>{({ open }) => (
            <UiDropDown.Item onClick={open}>
              Teilauftrag erfassen
            </UiDropDown.Item>
          )}</UiModal.Activator>
          <UiModal.Body>{({ close }) => (
            <div>
              <UiTitle level={1} isCentered>
                Neuer Teilauftrag
              </UiTitle>
              <SubtaskForm task={task} onClose={close} />
            </div>
          )}</UiModal.Body>
        </UiModal>
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
              <TaskForm report={report} task={task} onClose={close} />
            </React.Fragment>
          )}</UiModal.Body>
        </UiModal>
        {!task.isDone && (
          task.isClosed ? (
            <UiDropDown.Item onClick={handleReopen}>
              Öffnen
            </UiDropDown.Item>
          ) : (
            <UiDropDown.Item onClick={handleClose}>
              Schliessen
            </UiDropDown.Item>
          )
        )}
        <UiDropDown.Item onClick={handleDelete}>
          Löschen
        </UiDropDown.Item>
      </UiDropDown.Menu>
    </UiDropDown>
  )
}
export default TaskActions