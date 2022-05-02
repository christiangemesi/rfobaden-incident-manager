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
import { EntryTypeSource } from '@/models/EntryType'

interface Props {
  incident: Incident
  report?: Report | null
  onSave?: (report: Report) => void
  onClose?: () => void
}

const ReportForm: React.VFC<Props> = ({ incident, report = null, onSave: handleSave, onClose: handleClose }) => {
  const form = useForm<ModelData<Report>>(report, () => ({
    title: '',
    description: null,
    entryType: { type: EntryTypeSource.PHONE, number: null },
    number: null,
    notes: null,
    location: null,
    priority: Priority.MEDIUM,
    incidentId: incident.id,
    assigneeId: null,
    startsAt: null,
    endsAt: null,
    isKeyReport: false,
    isLocationRelevantReport: false,
    closedTaskIds: [],
    taskIds: [],
    isClosed: false,
    isDone: false,
    imageIds: [],
  }))

  useValidate(form, (validate) => {
    return ({
      title: [
        validate.notBlank(),
        validate.maxLength(100),
      ],
      description: [
        validate.notBlank({ allowNull: true }),
      ],
      entryType: {
        type: [],
        number: [
          validate.notBlank({ allowNull: true }),
          validate.maxLength(100),
        ],
      },
      notes: [
        validate.notBlank({ allowNull: true }),
      ],
      location: [
        validate.notBlank({ allowNull: true }),
        validate.maxLength(100),
      ],
      priority: [],
      incidentId: [],
      authorId: [],
      assigneeId: [],
      startsAt: [],
      endsAt: [],
      isKeyReport: [],
      isLocationRelevantReport: [],
      closedTaskIds: [],
      taskIds: [],
      isClosed: [],
      isDone: [],
      imageIds: [],
    })
  })

  useSubmit(form, async (formData: ModelData<Report>) => {
    const [data, error]: BackendResponse<Report> = report === null
      ? await BackendService.create(`incidents/${incident.id}/reports`, formData)
      : await BackendService.update(`incidents/${incident.id}/reports`, report.id, formData)
    if (error !== null) {
      throw error
    }
    const newReport = parseReport(data)
    ReportStore.save(newReport)
    if (handleSave) {
      handleSave(newReport)
    }
    clearForm(form)
    if (handleClose) {
      handleClose()
    }
  })

  useCancel(form, handleClose)

  const userIds = useUsers((users) => users.map(({ id }) => id))

  return (
    <div>
      <UiForm form={form}>
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

          <UiForm.Field field={form.entryType.type}>{(props) => (
            <UiSelectInput
              {...props}
              label="Meldeart"
              options={Object.values(EntryTypeType)}
              optionName={mapEntryTypeToName}
              menuPlacement="bottom"
            />
          )}</UiForm.Field>

          <UiForm.Field field={form.entryType.number}>{(props) => (
            <UiTextInput {...props} label="Nummer" placeholder="Nummer" />
          )}</UiForm.Field>

          <UiForm.Field field={form.notes}>{(props) => (
            <UiTextArea {...props} label="Notiz" placeholder="Notiz" />
          )}</UiForm.Field>

          <UiForm.Field field={form.location}>{(props) => (
            <UiTextInput {...props} label="Ort / Gebiet" placeholder="Ort / Gebiet" />
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

          <UiForm.Field field={form.startsAt}>{(props) => (
            <UiDateInput {...props} label="Beginn" placeholder="dd.mm.yyyy hh:mm" />
          )}</UiForm.Field>

          <UiForm.Field field={form.endsAt}>{(props) => (
            <UiDateInput {...props} label="Ende" placeholder="dd.mm.yyyy hh:mm" />
          )}</UiForm.Field>
          <UiForm.Buttons form={form} />
        </FormContainer>
      </UiForm>
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

export const mapEntryTypeToName = (type: string): string => {
  switch (type) {
  case EntryTypeSource.PHONE:
    return 'Telefon'
  case EntryTypeSource.EMAIL:
    return 'E-Mail'
  case EntryTypeSource.RADIO:
    return 'Funk'
  case EntryTypeSource.KP_FRONT:
    return 'KP Front'
  case EntryTypeSource.KP_BACK:
    return 'KP Rück'
  case EntryTypeSource.REPORTER:
    return 'Meldeläufer'
  default:
    return toTitleCase(type)
  }
}
  
const toTitleCase = (str: string): string => {
  return str
    .split(' ')
    .map((w) => w[0].toUpperCase() + w.substring(1).toLowerCase())
    .join(' ')
}

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`