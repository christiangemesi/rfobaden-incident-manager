import React from 'react'
import { useForm } from '@/components/Ui/Form'
import { ModelData } from '@/models/base/Model'
import Task, { TaskPriority } from '@/models/Task'
import { useValidate } from '@/components/Ui/Form/validate'
import UiForm from '@/components/Ui/Form/UiForm'
import UiTextInput from '@/components/Ui/Input/Text/UiTextInput'
import UiSelectInput from '@/components/Ui/Input/Select/UiSelectInput'
import { useUsers } from '@/stores/UserStore'
import User from '@/models/User'

const TaskForm: React.VFC = () => {
  const form = useForm<FormData>(() => ({
    title: '',
    description: null,
    location: null,
    priority: TaskPriority.LOW,
    assignee: null,
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
    assignee: [],
    closedAt: [],
    startsAt: [],
    endsAt: [],
    reportId:[],
    incidentId:[],
  }))

  const users = useUsers()

  const getUserName = (user: User ): string | null => {
    return user.firstName
  }

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
      <UiForm.Buttons form={form} />
    </form>
  )
}
export default TaskForm

type FormData = Omit<ModelData<Task>, 'author'>