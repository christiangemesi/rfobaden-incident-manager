import React from 'react'
import { clearForm, useCancel, useForm, useSubmit } from '@/components/Ui/Form'
import { ModelData } from '@/models/base/Model'
import Report, { parseReport, ReportPriority } from '@/models/Report'
import BackendService, { BackendResponse } from '@/services/BackendService'
import UiForm from '@/components/Ui/Form/UiForm'
import UiTextInput from '@/components/Ui/Input/Text/UiTextInput'
import ReportStore from '@/stores/ReportStore'
import UiSelectInput from '@/components/Ui/Input/Select/UiSelectInput'
import Incident from '@/models/Incident'
import UserStore, { useUsers } from '@/stores/UserStore'
import User from '@/models/User'
import Id from '@/models/base/Id'
import { useValidate } from '@/components/Ui/Form/validate'

interface Props {
  incident: Incident
  report?: Report | null
  onClose?: () => void
}

const ReportForm: React.VFC<Props> = ({ incident, report = null, onClose: handleClose }) => {
  const form = useForm<ModelData<Report>>(report, () => ({
    title: '',
    description: null,
    addendum: null,
    location: null,
    priority: ReportPriority.LOW,
    incidentId: incident.id,
    authorId: -1,
    assigneeId: null,
    startsAt: null,
    endsAt: null,
    completion: null,
    isComplete: false,
  }))

  useValidate(form, (validate) => {
    return ({
      title: [
        validate.notBlank(),
      ],
      description: [
        validate.notBlank({ allowNull: true }),
      ],
      addendum: [
        validate.notBlank({ allowNull: true }),
      ],
      location: [
        validate.notBlank({ allowNull: true }),
      ],
      priority: [],
      incidentId: [],
      authorId: [],
      assigneeId: [],
      startsAt: [],
      endsAt: [],
      completion: [],
      isComplete: [],
    })
  })

  useSubmit(form, async (formData: ModelData<Report>) => {
    const [data, error]: BackendResponse<Report> = report === null
      ? await BackendService.create(`incidents/${incident.id}/reports`, formData)
      : await BackendService.update(`incidents/${incident.id}/reports`, report.id, formData)
    if (error !== null) {
      throw error
    }
    ReportStore.save(parseReport(data))
    clearForm(form)
    if (handleClose) {
      handleClose()
    }
  })

  useCancel(form, handleClose)


  const userIds = useUsers((users) => users.map(({ id }) => id))

  return (
    <div>
      <form>
        <UiForm.Field field={form.title}>{(props) => (
          <UiTextInput {...props} label="Titel" />
        )}</UiForm.Field>
        <UiForm.Field field={form.description}>{(props) => (
          <UiTextInput {...props} label="Beschreibung" />
        )}</UiForm.Field>
        <UiForm.Field field={form.addendum}>{(props) => (
          <UiTextInput {...props} label="Addendum" />
        )}</UiForm.Field>
        <UiForm.Field field={form.location}>{(props) => (
          <UiTextInput {...props} label="Ort" />
        )}</UiForm.Field>
        <UiForm.Field field={form.priority}>{(props) => (
          <UiSelectInput {...props} label="Priorität" options={Object.values(ReportPriority)} />
        )}</UiForm.Field>
        <UiForm.Field field={form.assigneeId}>{(props) => (
          <UiSelectInput {...props} label="Zuweisung" options={userIds} optionName={mapUserIdToName} />
        )}</UiForm.Field>
        <UiForm.Buttons form={form} />
      </form>
    </div>
  )
}
export default ReportForm

const mapUserIdToName = (id: Id<User>): string | null => {
  const user = UserStore.find(id)
  return user === null
    ? null
    : `${user.firstName} ${user.lastName}`
}