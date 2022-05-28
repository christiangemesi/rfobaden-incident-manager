import React, { useCallback } from 'react'
import UiDropDown from '@/components/Ui/DropDown/UiDropDown'
import UiIconButton from '@/components/Ui/Icon/Button/UiIconButton'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import SubtaskForm from '@/components/Subtask/Form/SubtaskForm'
import BackendService from '@/services/BackendService'
import Subtask from '@/models/Subtask'
import SubtaskStore from '@/stores/SubtaskStore'
import Task from '@/models/Task'
import TrackableEditAction from '@/components/Trackable/Actions/TrackableEditAction'
import UiPrinter from '@/components/Ui/Printer/UiPrinter'
import SubtaskPrintView from '@/components/Subtask/PrintView/SubtaskPrintView'

interface Props {
  task: Task
  subtask: Subtask
  onDelete?: () => void
}

const SubtaskActions: React.VFC<Props> = ({ task, subtask, onDelete: handleDeleteCb }) => {
  const handleDelete = useCallback(async () => {
    if (confirm(`Sind sie sicher, dass sie den Teilauftrag "${subtask.title}" löschen wollen?`)) {
      const error = await BackendService.delete(`incidents/${subtask.incidentId}/reports/${subtask.reportId}/tasks/${subtask.taskId}/subtasks`, subtask.id)
      if (error !== null) {
        throw error
      }
      if (handleDeleteCb) {
        handleDeleteCb()
      }
      SubtaskStore.remove(subtask.id)
    }
  }, [subtask, handleDeleteCb])

  return (
    <UiDropDown>
      <UiDropDown.Trigger>{({ toggle }) => (
        <UiIconButton onClick={toggle}>
          <UiIcon.More />
        </UiIconButton>
      )}</UiDropDown.Trigger>
      <UiDropDown.Menu>
        <TrackableEditAction title="Teilauftrag bearbeiten">{({ close }) => (
          <SubtaskForm task={task} subtask={subtask} onClose={close} />
        )}</TrackableEditAction>
        <UiPrinter renderContent={() => <SubtaskPrintView subtask={subtask} />}>{({ trigger }) => (
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
export default SubtaskActions