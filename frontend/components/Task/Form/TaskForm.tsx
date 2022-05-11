import React from 'react'
import { clearForm, useCancel, useForm, useSubmit } from '@/components/Ui/Form'
import { ModelData } from '@/models/base/Model'
import Task, { parseTask } from '@/models/Task'
import { useValidate } from '@/components/Ui/Form/validate'
import UiForm from '@/components/Ui/Form/UiForm'
import UiTextInput from '@/components/Ui/Input/Text/UiTextInput'
import UiSelectInput from '@/components/Ui/Input/Select/UiSelectInput'
import UserStore, { useUsers } from '@/stores/UserStore'
import User from '@/models/User'
import Id from '@/models/base/Id'
import BackendService, { BackendResponse } from '@/services/BackendService'
import TaskStore from '@/stores/TaskStore'
import Report from '@/models/Report'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiTextArea from '@/components/Ui/Input/Text/UiTextArea'
import UiPrioritySlider from '@/components/Ui/PrioritySlider/UiPrioritySlider'
import Priority from '@/models/Priority'
import UiDateInput from '@/components/Ui/Input/Date/UiDateInput'
import styled from 'styled-components'

interface Props {
  report: Report
  task?: Task | null
  onSave?: (task: Task) => void
  onClose?: () => void
}

const TaskForm: React.VFC<Props> = ({ report, task = null, onSave: handleSave, onClose: handleClose }) => {
  const form = useForm<ModelData<Task>>(task, () => ({
    title: '',
    description: null,
    location: null,
    priority: Priority.MEDIUM,
    assigneeId: null,
    closedAt: null,
    startsAt: null,
    endsAt: null,
    reportId: -1,
    incidentId: -1,
    closedSubtaskIds: [],
    subtaskIds: [],
    isClosed: false,
    isDone: false,
    imageIds: [],
    documentIds: [],
  }))

  useValidate(form, (validate) => ({
    title: [
      validate.notBlank(),
      validate.maxLength(100),
    ],
    description: [
      validate.notBlank({ allowNull: true }),
    ],
    location: [
      validate.notBlank({ allowNull: true }),
      validate.maxLength(100),
    ],
    priority: [],
    assigneeId: [],
    closedAt: [],
    startsAt: [],
    endsAt: [],
    reportId: [],
    incidentId: [],
    closedSubtaskIds: [],
    subtaskIds: [],
    isClosed: [],
    isDone: [],
    imageIds: [],
    documentIds: [],
  }))

  useSubmit(form, async (formData: ModelData<Task>) => {
    const apiEndpoint = `incidents/${report.incidentId}/reports/${report.id}/tasks`
    const [data, error]: BackendResponse<Task> = task === null
      ? await BackendService.create(apiEndpoint, formData)
      : await BackendService.update(apiEndpoint, task.id, formData)
    if (error !== null) {
      throw error
    }
    const newTask = parseTask(data)
    TaskStore.save(newTask)
    if (handleSave) {
      handleSave(newTask)
    }
    clearForm(form)
    if (handleClose) {
      handleClose()
    }
  })

  useCancel(form, handleClose)

  const userIds = useUsers((users) => users.map(({ id }) => id))


  return (
    <UiForm form={form}>
      <FormContainer>

        <UiGrid.Col style={{ textAlign: 'right' }}>
          <UiForm.Field field={form.priority}>{(props) => (
            <UiPrioritySlider {...props} />
          )}</UiForm.Field>
        </UiGrid.Col>

        <UiForm.Field field={form.title}>{(props) => (
          <UiTextInput {...props} label="Titel" placeholder="Titel" />
        )}</UiForm.Field>


        <UiForm.Field field={form.description}>{(props) => (
          <UiTextArea {...props} label="Beschreibung" placeholder="Beschreibung" />
        )}</UiForm.Field>


        <UiForm.Field field={form.assigneeId}>{(props) => (
          <UiSelectInput
            {...props}
            label="Zuweisung"
            options={userIds}
            optionName={mapUserIdToName}
            menuPlacement="top"
          />
        )}</UiForm.Field>


        <UiForm.Field field={form.location}>{(props) => (
          <UiTextInput {...props} label="Ort / Gebiet" placeholder="Ort / Gebiet" />
        )}</UiForm.Field>

        <UiGrid gap={0.5}>
          <UiGrid.Col>
            <UiForm.Field field={form.startsAt}>{(props) => (
              <UiDateInput {...props} label="Beginn" placeholder="dd.mm.yyyy hh:mm" />
            )}</UiForm.Field>
          </UiGrid.Col>

          <UiForm.Field field={form.endsAt}>{(props) => (
            <UiDateInput {...props} label="Ende" placeholder="dd.mm.yyyy hh:mm" />
          )}</UiForm.Field>
        </UiGrid>

        <UiForm.Buttons form={form} />
      </FormContainer>
    </UiForm>

  )
}
export default TaskForm

const mapUserIdToName = (id: Id<User>): string | null => {
  const user = UserStore.find(id)
  return user === null
    ? null
    : `${user.firstName} ${user.lastName}`
}

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`
