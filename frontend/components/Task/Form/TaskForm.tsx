import React from 'react'
import { clearForm, useCancel, useForm, useSubmit } from '@/components/Ui/Form'
import { ModelData } from '@/models/base/Model'
import Task, { parseTask, TaskPriority } from '@/models/Task'
import { useValidate } from '@/components/Ui/Form/validate'
import UiForm from '@/components/Ui/Form/UiForm'
import UiTextInput from '@/components/Ui/Input/Text/UiTextInput'
import UiSelectInput from '@/components/Ui/Input/Select/UiSelectInput'
import UserStore, { useUsers } from '@/stores/UserStore'
import User from '@/models/User'
import Id from '@/models/base/Id'
import BackendService, { BackendResponse } from '@/services/BackendService'
import TaskStore from '@/stores/TaskStore'
import Incident from '@/models/Incident'
import Report from '@/models/Report'

interface Props {
  incident: Incident
  report: Report
  task?: Task | null
  onClose?: () => void
}

const TaskForm: React.VFC<Props> = ({ incident,report, task = null, onClose: handleClose } ) => {
  const form = useForm<ModelData<Task>>(task,() => ({
    title: '',
    description: null,
    location: null,
    priority: TaskPriority.LOW,
    assigneeId: null,
    closedAt: null,
    startsAt: null,
    endsAt: null,
    reportId: -1,
    incidentId: -1,
  }))

  useValidate(form, (validate) => ({
    title: [
      validate.notBlank(),
    ],
    description: [
      validate.notBlank({ allowNull: true }),
    ],
    location:  [
      validate.notBlank({ allowNull: true }),
    ],
    priority: [],
    assigneeId: [],
    closedAt: [],
    startsAt: [],
    endsAt: [],
    reportId:[],
    incidentId:[],
  }))

  useSubmit(form, async(formData: ModelData<Task>) => {
    const [data, error]: BackendResponse<Task> = task === null
      ? await BackendService.create(`incidents/${incident.id}/reports/${report.id}/tasks`, formData)
      : await BackendService.update(`incidents/${incident.id}/reports/${report.id}/tasks`, task.id, formData)
    if (error !== null) {
      throw error
    }
    TaskStore.save(parseTask(data))
    clearForm(form)
    if (handleClose) {
      handleClose()
    }
  })

  useCancel(form, handleClose)

  const userIds = useUsers((users) => users.map(({ id }) => id))

  return (
    <form>
      <UiForm.Field field={form.title}>{(props) => (
        <UiTextInput {...props} label="Titel" />
      )}</UiForm.Field>
      <UiForm.Field field={form.description}>{(props) => (
        <UiTextInput {...props} label="Beschreibung" />
      )}</UiForm.Field>
      <UiForm.Field field={form.location}>{(props) => (
        <UiTextInput {...props} label="Ort" />
      )}</UiForm.Field>
      <UiForm.Field field={form.priority}>{(props) => (
        <UiSelectInput {...props} label="Priorität" options={Object.values(TaskPriority)} />
      )}</UiForm.Field>
      <UiForm.Field field={form.assigneeId}>{(props) => (
        <UiSelectInput {...props} label="Zuweisung" options={userIds} optionName={mapUserIdToName} />
      )}</UiForm.Field>
      <UiForm.Buttons form={form} />
    </form>
  )
}
export default TaskForm

const mapUserIdToName = (id: Id<User>): string | null => {
  const user = UserStore.find(id)
  return user === null
    ? null
    : `${user.firstName} ${user.lastName}`
}
