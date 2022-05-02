import Report from '@/models/Report'
import Task, { parseTask } from '@/models/Task'
import React, { useCallback } from 'react'
import UiDropDown from '@/components/Ui/DropDown/UiDropDown'
import UiIconButton from '@/components/Ui/Icon/Button/UiIconButton'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import TaskForm from '@/components/Task/Form/TaskForm'
import BackendService, { BackendResponse } from '@/services/BackendService'
import TaskStore from '@/stores/TaskStore'
import { FileId } from '@/models/FileUpload'
import TrackableCloseAction from '@/components/Trackable/Actions/TrackableCloseAction'
import TrackableEditAction from '@/components/Trackable/Actions/TrackableEditAction'
import TrackableFileUploadAction from '@/components/Trackable/Actions/TrackableFileUploadAction'
import UiPrinter from '@/components/Ui/Printer/UiPrinter'
import TaskPrintView from '../PrintView/TaskPrintView'

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

  const addImageId = useCallback((fileId: FileId) => {
    TaskStore.save({ ...task, imageIds: [...task.imageIds, fileId]})
  }, [task])

  const addDocumentId = useCallback((fileId: FileId) => {
    TaskStore.save({ ...task, documentIds: [...task.documentIds, fileId]})
  }, [task])

  return (
    <UiDropDown>
      <UiDropDown.Trigger>{({ toggle }) => (
        <UiIconButton onClick={toggle}>
          <UiIcon.More />
        </UiIconButton>
      )}</UiDropDown.Trigger>
      <UiDropDown.Menu>
        <TrackableEditAction title="Auftrag bearbeiten">{({ close }) => (
          <TaskForm report={report} task={task} onClose={close} />
        )}</TrackableEditAction>

        {!task.isDone && (
          <TrackableCloseAction isClosed={task.isClosed} onClose={handleClose} onReopen={handleReopen} />
        )}

        <TrackableFileUploadAction
          id={task.id}
          modelName="task"
          onAddFile={addImageId}
          type="image"
        />
        <TrackableFileUploadAction
          id={task.id}
          modelName="task"
          onAddFile={addDocumentId}
          type="document"
        />

        <UiPrinter renderContent={() => <TaskPrintView task={task} />}>{({ trigger }) => (
          <UiDropDown.Item onClick={trigger}>
            Drucken
          </UiDropDown.Item>
        )}</UiPrinter>

        <UiDropDown.Item onClick={handleDelete}>
          Löschen
        </UiDropDown.Item>
      </UiDropDown.Menu>
    </UiDropDown>
  )
}
export default TaskActions