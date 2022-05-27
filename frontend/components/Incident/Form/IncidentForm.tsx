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
import UiTextArea from '@/components/Ui/Input/Text/UiTextArea'
import UiDateInput from '@/components/Ui/Input/Date/UiDateInput'
import styled from 'styled-components'

interface Props {
  incident?: Incident | null
  onClose?: () => void
  buttonText?: string
}

const IncidentForm: React.VFC<Props> = ({ incident = null, onClose: handleClose, buttonText = 'Erstellen' }) => {
  const form = useForm<ModelData<Incident>>(incident, () => ({
    title: '',
    description: null,
    authorId: -1,
    closeReason: null,
    isClosed: false,
    isDone: false,
    closedAt: null,
    startsAt: null,
    endsAt: null,
    closedReportIds: [],
    reportIds: [],
    closedTransportIds: [],
    transportIds: [],
    images: [],
    documents: [],
    organizationIds: [],
  }))

  useValidate(form, (validate) => ({
    title: [
      validate.notBlank(),
      validate.maxLength(100),
    ],
    description: [
      validate.notBlank({ allowNull: true }),
    ],
    startsAt: [],
    authorId: [],
    closeReason: [],
    closedAt: [],
    isClosed: [],
    isDone: [],
    endsAt: [],
    closedReportIds: [],
    reportIds: [],
    closedTransportIds: [],
    transportIds: [],
    images: [],
    documents: [],
    organizationIds: [],
  }))

  useSubmit(form, async (incidentData: ModelData<Incident>) => {
    const [data]: BackendResponse<Incident> = incident === null
      ? await BackendService.create('incidents', incidentData)
      : await BackendService.update('incidents', incident.id, incidentData)
    IncidentStore.save(parseIncident(data))
    clearForm(form)
    if (handleClose) {
      handleClose()
    }
  })

  useCancel(form, handleClose)

  return (
    <UiForm form={form}>
      <FormContainer>
        <UiForm.Field field={form.title}>{(props) => (
          <UiTextInput {...props} label="Titel" placeholder="Titel" />
        )}</UiForm.Field>

        <UiForm.Field field={form.description}>{(props) => (
          <UiTextArea {...props} label="Beschreibung" placeholder="Beschreibung" rows={5} />
        )}</UiForm.Field>

        <UiGrid gapH={1}>
          <UiGrid.Col size={{ xs: 12, md: 6 }}>
            <UiForm.Field field={form.startsAt}>{(props) => (
              <UiDateInput {...props} label="Beginn" placeholder="dd.mm.yyyy hh:mm" placement="top" />
            )}</UiForm.Field>
          </UiGrid.Col>
          <UiGrid.Col size={{ xs: 12, md: 6 }}>
            <UiForm.Field field={form.endsAt}>{(props) => (
              <UiDateInput {...props} label="Ende" placeholder="dd.mm.yyyy hh:mm" placement="top" />
            )}</UiForm.Field>
          </UiGrid.Col>
        </UiGrid>

        <UiForm.Buttons form={form} text={buttonText} />
      </FormContainer>
    </UiForm>
  )
}

export default IncidentForm

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`
