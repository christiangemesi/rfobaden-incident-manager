import React from 'react'
import { clearForm, useCancel, useForm, useSubmit } from '@/components/Ui/Form'
import { ModelData } from '@/models/base/Model'
import Transport, { parseTransport } from '@/models/Transport'
import BackendService, { BackendResponse } from '@/services/BackendService'
import UiForm from '@/components/Ui/Form/UiForm'
import UiTextInput from '@/components/Ui/Input/Text/UiTextInput'
import TransportStore from '@/stores/TransportStore'
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

interface Props {
  incident: Incident
  transport?: Transport | null
  onSave?: (transport: Transport) => void
  onClose?: () => void
}

const TransportForm: React.VFC<Props> = ({ incident, transport = null, onSave: handleSave, onClose: handleClose }) => {
  const form = useForm<ModelData<Transport>>(transport, () => ({
    title: '',
    description: null,
    priority: Priority.MEDIUM,
    incidentId: incident.id,
    assigneeId: null,
    peopleInvolved: null,
    driver: null,
    sourcePlace: null,
    destinationPlace: null,
    startsAt: null,
    endsAt: null,
    closedTransportIds: [],
    transportIds: [],
    isClosed: false,
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
      priority: [],
      incidentId: [],
      authorId: [],
      assigneeId: [],
      peopleInvolved: [
        validate.notBlank(),
        // TODO is number
      ],
      driver: [],
      sourcePlace: [],
      destinationPlace: [],
      startsAt: [],
      endsAt: [],
      closedTransportIds: [],
      transportIds: [],
      isClosed: [],
    })
  })

  useSubmit(form, async (formData: ModelData<Transport>) => {
    const [data, error]: BackendResponse<Transport> = transport === null
      ? await BackendService.create(`incidents/${incident.id}/transports`, formData)
      : await BackendService.update(`incidents/${incident.id}/transports`, transport.id, formData)
    if (error !== null) {
      throw error
    }
    const newTransport = parseTransport(data)
    TransportStore.save(newTransport)
    if (handleSave) {
      handleSave(newTransport)
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

          <UiForm.Field field={form.driver}>{(props) => (
            <UiTextInput {...props} label="Fahrer" placeholder="Fahrer" />
          )}</UiForm.Field>

          <UiForm.Field field={form.peopleInvolved}>{(props) => (
            <UiTextInput {...props} label="Anz. Personen" placeholder="Anz. Personen" />
          )}</UiForm.Field>

          <UiForm.Field field={form.vehicle}>{(props) => (
            <UiTextInput {...props} label="Fahrzeug" placeholder="Fahrzeug" />
          )}</UiForm.Field>

          <UiForm.Field field={form.trailer}>{(props) => (
            <UiTextInput {...props} label="Anhänger" placeholder="Anhänger" />
          )}</UiForm.Field>

          <UiForm.Field field={form.sourcePlace}>{(props) => (
            <UiTextInput {...props} label="Abfahrtsort" placeholder="Abfahrtsort" />
          )}</UiForm.Field>

          <UiForm.Field field={form.destinationPlace}>{(props) => (
            <UiTextInput {...props} label="Ankunftsort" placeholder="Ankunftsort" />
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
      </UiForm>
    </div>
  )
}
export default TransportForm

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