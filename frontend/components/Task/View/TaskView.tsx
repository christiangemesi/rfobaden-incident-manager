import Task, { parseTask } from '@/models/Task'
import React, { useCallback } from 'react'
import UiTitle from '@/components/Ui/Title/UiTitle'
import SubtaskList from '@/components/Subtask/List/SubtaskList'
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
import UiDescription from '@/components/Ui/Description/UiDescription'
import EventHelper from '@/utils/helpers/EventHelper'
import Report from '@/models/Report'
import TaskInfo from '@/components/Task/Info/TaskInfo'

interface Props {
  report: Report
  task: Task
  onClose?: () => void
}

const TaskView: React.VFC<Props> = ({ report, task, onClose: handleCloseView }) => {
  const subtasks = useSubtasksOfTask(task.id)
  const { loading: isLoading } = useAsync(async () => {
    if (loadedTasks.has(task.id)) {
      return
    }
    const [subtasks, error]: BackendResponse<Subtask[]> = await BackendService.list(
      `incidents/${task.incidentId}/reports/${task.reportId}/tasks/${task.id}/subtasks`,
    )
    if (error !== null) {
      throw error
    }
    SubtaskStore.saveAll(subtasks.map(parseSubtask))
    loadedTasks.add(task.id)
  }, [task])

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
      <Heading onClick={EventHelper.stopPropagation}>
        <UiGrid justify="space-between" align="start" gap={1} style={{ flexWrap: 'nowrap' }}>
          <div>
            <TaskInfo task={task} />
            <UiTitle level={4}>
              {task.title}
            </UiTitle>
          </div>

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
            </UiDropDown>
            <UiIconButton onClick={handleCloseView}>
              <UiIcon.CancelAction />
            </UiIconButton>
          </UiIconButtonGroup>
        </UiGrid>

        <UiDescription description={task.description} />
      </Heading>

      <Content>
        {isLoading ? (
          <UiIcon.Loader isSpinner />
        ) : (
          // This scrollbar is fully disabled, but it's still required for the drag-and-drop inside
          // the SubtaskList to work. Why is not clear right now, but hey, it works like this.
          <UiScroll style={{ width: '100%', height: '100%' }} disableX disableY>
            <SubtaskList subtasks={subtasks} />
          </UiScroll>
        )}
      </Content>
    </Container>
  )
}
export default TaskView

const loadedTasks = new Set<Id<Task>>()

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const Heading = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
  width: 100%;
  margin-bottom: 1rem;
`

const Content = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  width: 100%;
`
