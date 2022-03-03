import Task, { parseTask } from '@/models/Task'
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
import UiIconButtonGroup from '@/components/Ui/Icon/Button/Group/UiIconButtonGroup'
import styled from 'styled-components'
import UiScroll from '@/components/Ui/Scroll/UiScroll'
import SubtaskForm from '@/components/Subtask/Form/SubtaskForm'

interface Props {
  task: Task
  onClose?: () => void
}

const TaskView: React.VFC<Props> = ({ task, onClose: handleCloseView }) => {
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

  const handleDelete = useCallback(async () => {
    if (confirm(`Sind sie sicher, dass sie den Auftrag "${task.title}" schliessen wollen?`)) {
      await BackendService.delete(`incidents/${task.incidentId}/reports/${task.reportId}/tasks`, task.id)
      TaskStore.remove(task.id)
      if (handleCloseView) {
        handleCloseView()
      }
    }
  }, [task, handleCloseView])

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
    <Container>
      <UiGrid justify="space-between" align="center">
        <UiTitle level={4}>
          {task.title}
        </UiTitle>

        <UiIconButtonGroup>
          <UiDropDown>
            <UiDropDown.Trigger>
              <UiIconButton>
                <UiIcon.More />
              </UiIconButton>
            </UiDropDown.Trigger>
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
                  <SubtaskForm incident={incident} report={report} task={task} onClose={close} />
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
                  <TaskForm incident={incident} report={report} task={task} onClose={close} />
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
          </UiDropDown>
          <UiIconButton onClick={handleCloseView}>
            <UiIcon.CancelAction />
          </UiIconButton>
        </UiIconButtonGroup>
      </UiGrid>

      {isLoading ? (
        <UiIcon.Loader isSpinner />
      ) : (
        <UiScroll style={{ height: '100%' }}>
          <SubtaskList incident={incident} report={report} task={task} subtasks={subtasks} activeSubtask={null} />
        </UiScroll>
      )}
    </Container>
  )
}
export default TaskView

const loadedTasks = new Set<Id<Task>>()

const Container = styled.div`
  height: 100%;
`