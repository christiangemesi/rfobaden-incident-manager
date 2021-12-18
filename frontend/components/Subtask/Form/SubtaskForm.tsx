import React from 'react'
import { clearForm, useCancel, useForm, useSubmit } from '@/components/Ui/Form'
import { ModelData } from '@/models/base/Model'
import Task from '@/models/Task'
import { useValidate } from '@/components/Ui/Form/validate'
import UiForm from '@/components/Ui/Form/UiForm'
import UiTextInput from '@/components/Ui/Input/Text/UiTextInput'
import UiSelectInput from '@/components/Ui/Input/Select/UiSelectInput'
import UserStore, { useUsers } from '@/stores/UserStore'
import User from '@/models/User'
import Id from '@/models/base/Id'
import BackendService, { BackendResponse } from '@/services/BackendService'
import Incident from '@/models/Incident'
import Report from '@/models/Report'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiTextArea from '@/components/Ui/Input/Text/UiTextArea'
import UiPrioritySlider from '@/components/Ui/PrioritySlider/UiPrioritySlider'
import Priority from '@/models/Priority'
import UiDateInput from '@/components/Ui/Input/Date/UiDateInput'
import styled from 'styled-components'
import Subtask, { parseSubtask } from '@/models/Subtask'
import SubtaskStore from '@/stores/SubtaskStore'

interface Props {
  incident: Incident
  report: Report
  task: Task
  subtask?: Subtask | null
  onClose?: () => void
}

const SubtaskForm: React.VFC<Props> = ({ incident, report, task, subtask = null, onClose: handleClose }) => {
  const form = useForm<ModelData<Subtask>>(subtask, () => ({
    title: '',
    description: null,
    priority: Priority.MEDIUM,
    assigneeId: null,
    closedAt: null,
    startsAt: null,
    endsAt: null,
    taskId: -1,
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
    priority: [],
    assigneeId: [],
    closedAt: [],
    startsAt: [],
    endsAt: [],
    taskId: [],
    reportId: [],
    incidentId: [],
  }))

  useSubmit(form, async (formData: ModelData<Subtask>) => {
    const [data, error]: BackendResponse<Subtask> = subtask === null
      ? await BackendService.create(`incidents/${incident.id}/reports/${report.id}/tasks/${task.id}/subtasks`, formData)
      : await BackendService.update(`incidents/${incident.id}/reports/${report.id}/tasks/${task.id}/subtasks`, subtask.id, formData)
    if (error !== null) {
      throw error
    }
    SubtaskStore.save(parseSubtask(data))
    clearForm(form)
    if (handleClose) {
      handleClose()
    }
  }, [subtask])

  useCancel(form, handleClose)

  const userIds = useUsers((users) => users.map(({ id }) => id))

  return (
    <form>
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
          <UiSelectInput {...props} label="Zuweisung" options={userIds} optionName={mapUserIdToName} />
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
    </form>
  )
}
export default SubtaskForm

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