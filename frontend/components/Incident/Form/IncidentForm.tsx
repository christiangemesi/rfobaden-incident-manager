import React from 'react'
import { clearForm, useCancel, useForm, useSubmit } from '@/components/Ui/Form'
import BackendService, { BackendResponse } from '@/services/BackendService'
import IncidentStore from '@/stores/IncidentStore'
import UiForm from '@/components/Ui/Form/UiForm'
import UiTextInput from '@/components/Ui/Input/Text/UiTextInput'
import Incident, { parseIncident } from '@/models/Incident'
import { ModelData } from '@/models/base/Model'
import { useValidate } from '@/components/Ui/Form/validate'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiTextArea from '@/components/Ui/Input/Text/UiTextArea'

interface Props {
  incident: Incident | null
  onClose?: () => void
}

const IncidentForm: React.VFC<Props> = ({ incident, onClose: handleClose }) => {
  const form = useForm<ModelData<Incident>>(incident, () => ({
    title: '',
    description: null,
    authorId: -1,
    closeReason: null,
    isClosed: false,
    closedAt: null,
    startsAt: null,
    endsAt: null,
  }))

  useValidate(form, (validate) => ({
    title: [
      validate.notBlank(),
    ],
    description: [
      validate.notBlank({ allowNull: true }),
    ],
    startsAt: [],
    authorId: [],
    closeReason: [],
    closedAt: [],
    isClosed: [],
    endsAt: [],
  }))

  useSubmit(form, async (incidentData: ModelData<Incident>) => {
    const [data]: BackendResponse<Incident> = incident === null ? (
      await BackendService.create('incidents', incidentData)
    ) : (
      await BackendService.update('incidents', incident.id, incidentData)
    )

    const newIncident = parseIncident(data)
    IncidentStore.save(newIncident)
    clearForm(form)
    if (handleClose) {
      handleClose()
    }
  })

  useCancel(form, handleClose)

  return (
    <form>
      <UiGrid gap={0.5}>
        <UiGrid.Col size={12}>
          <UiForm.Field field={form.title}>{(props) => (
            <UiTextInput {...props} label="Titel" placeholder="Titel" />
          )}</UiForm.Field>
        </UiGrid.Col>

        <UiGrid.Col size={12}>
          <UiForm.Field field={form.description}>{(props) => (
            <UiTextArea {...props} label="Beschreibung" placeholder="Beschreibung" />
          )}</UiForm.Field>
        </UiGrid.Col>

        <UiGrid.Col>
          <UiForm.Field field={form.closeReason}>{(props) => (
            <UiTextInput {...props} label="Start Datum" placeholder="Start Datum">
              <UiIcon.Organization />
            </UiTextInput>
          )}</UiForm.Field>
        </UiGrid.Col>

        <UiGrid.Col>
          <UiForm.Field field={form.closeReason}>{(props) => (
            <UiTextInput {...props} label="End Datum" placeholder="End Datum">
              <UiIcon.Organization />
            </UiTextInput>
          )}</UiForm.Field>
        </UiGrid.Col>
      </UiGrid>
      <UiForm.Buttons form={form} />
    </form>
  )
}

export default IncidentForm
