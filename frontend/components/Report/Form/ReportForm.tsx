import React from 'react'
import { clearForm, useCancel, useForm, useSubmit } from '@/components/Ui/Form'
import { ModelData } from '@/models/base/Model'
import Report, { parseReport } from '@/models/Report'
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
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiTextArea from '@/components/Ui/Input/Text/UiTextArea'
import UiToggle from '@/components/Ui/Toggle/UiToggle'
import UiPrioritySlider from '@/components/Ui/PrioritySlider/UiPrioritySlider'
import Priority from '@/models/Priority'
import UiDateInput from '@/components/Ui/Input/Date/UiDateInput'
import styled from 'styled-components'
import IncidentStore from '@/stores/IncidentStore'

interface Props {
  incident: Incident
  report?: Report | null
  onClose?: () => void
}

const ReportForm: React.VFC<Props> = ({ incident, report = null, onClose: handleClose }) => {
  const form = useForm<ModelData<Report>>(report, () => ({
    title: '',
    description: null,
    notes: null,
    location: null,
    priority: Priority.MEDIUM,
    incidentId: incident.id,
    assigneeId: null,
    startsAt: null,
    endsAt: null,
    isKeyReport: false,
    isLocationRelevantReport: false,
    closedTaskCount: 0,
    taskCount: 0,
    isClosed: false,
  }))

  useValidate(form, (validate) => {
    return ({
      title: [
        validate.notBlank(),
      ],
      description: [
        validate.notBlank({ allowNull: true }),
      ],
      notes: [
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
      isKeyReport: [],
      isLocationRelevantReport: [],
      closedTaskCount: [],
      taskCount: [],
      isClosed: [],
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
    if (report === null) {
      IncidentStore.save({
        ...incident,
        reportCount: incident.reportCount + 1,
      })
    }

    clearForm(form)
    if (handleClose) {
      handleClose()
    }
  })

  useCancel(form, handleClose)

  const userIds = useUsers((users) => users.map(({ id }) => id))

  console.log(form)

  return (
    <div>
      <form>
        <FormContainer>
          <UiGrid align="center">
            <UiGrid.Col textAlign="left">
              <UiForm.Field field={form.isKeyReport}>{(props) => (
                <UiToggle {...props} label="Schlüsselmeldung" />
              )}</UiForm.Field>
            </UiGrid.Col>

            <UiGrid.Col textAlign="center">
              <UiForm.Field field={form.isLocationRelevantReport}>{(props) => (
                <UiToggle {...props} label="Lagerelevant" />
              )}</UiForm.Field>
            </UiGrid.Col>

            <UiGrid.Col textAlign="right">
              <UiForm.Field field={form.priority}>{(props) => (
                <UiPrioritySlider {...props} />
              )}</UiForm.Field>
            </UiGrid.Col>
          </UiGrid>

          <UiForm.Field field={form.title}>{(props) => (
            <UiTextInput {...props} label="Titel" placeholder="Titel" />
          )}</UiForm.Field>

          <UiForm.Field field={form.description}>{(props) => (
            <UiTextArea {...props} label="Beschreibung" placeholder="Beschreibung" />
          )}</UiForm.Field>

          <UiForm.Field field={form.notes}>{(props) => (
            <UiTextArea {...props} label="Notiz" placeholder="Notiz" />
          )}</UiForm.Field>

          <UiForm.Field field={form.location}>{(props) => (
            <UiTextInput {...props} label="Ort / Gebiet" placeholder="Ort / Gebiet" />
          )}</UiForm.Field>

          <UiForm.Field field={form.assigneeId}>{(props) => (
            <UiSelectInput {...props} label="Zuweisung" options={userIds} optionName={mapUserIdToName} />
          )}</UiForm.Field>

          <UiForm.Field field={form.startsAt}>{(props) => (
            <UiDateInput {...props} label="Beginn" placeholder="dd.mm.yyyy hh:mm" />
          )}</UiForm.Field>

          <UiForm.Field field={form.endsAt}>{(props) => (
            <UiDateInput {...props} label="Ende" placeholder="dd.mm.yyyy hh:mm" />
          )}</UiForm.Field>
          <UiForm.Buttons form={form} />
        </FormContainer>
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

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`