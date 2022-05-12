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
import UiPrioritySlider from '@/components/Ui/PrioritySlider/UiPrioritySlider'
import Priority from '@/models/Priority'
import UiDateInput from '@/components/Ui/Input/Date/UiDateInput'
import styled from 'styled-components'
import { useCurrentUser } from '@/stores/SessionStore'
import UiNumberInput from '@/components/Ui/Input/Number/UiNumberInput'

interface Props {
  incident: Incident
  transport?: Transport | null
  onSave?: (transport: Transport) => void
  onClose?: () => void
}

const TransportForm: React.VFC<Props> = ({ incident, transport = null, onSave: handleSave, onClose: handleClose }) => {
  const currentUser = useCurrentUser()

  const form = useForm<ModelData<Transport>>(transport, () => ({
    title: '',
    description: null,
    incidentId: incident.id,
    assigneeId: currentUser.id,
    priority: Priority.MEDIUM,
    peopleInvolved: 0,
    driver: null,
    vehicle: '',
    trailer: null,
    pointOfDeparture: null,
    pointOfArrival: null,
    startsAt: null,
    endsAt: null,
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
      pointOfDeparture: [
        validate.notBlank({ allowNull: true }),
        validate.maxLength(100),
      ],
      pointOfArrival: [
        validate.notBlank({ allowNull: true }),
        validate.maxLength(100),
      ],
      trailer: [
        validate.notBlank({ allowNull: true }),
        validate.maxLength(100),
      ],
      vehicle: [
        validate.notBlank({ allowNull: true }),
        validate.maxLength(100),
      ],
      driver: [
        validate.notBlank({ allowNull: true }),
        validate.maxLength(100),
      ],
      peopleInvolved: [
        (value) => value >= 0 || 'muss positiv sein',
      ],
      priority: [],
      isClosed: [],
      startsAt: [],
      endsAt: [],
      assigneeId: [],
      incidentId: [],
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

          <UiGrid gap={0.5}>
            <UiGrid.Col size={{ xs: 12, sm: 9 }}>
              <UiForm.Field field={form.vehicle}>{(props) => (
                <UiTextInput {...props} label="Fahrzeug" placeholder="Fahrzeug" />
              )}</UiForm.Field>
            </UiGrid.Col>
            <UiGrid.Col size={{ xs: 12, sm: 3 }}>
              <UiForm.Field field={form.peopleInvolved}>{(props) => (
                <UiNumberInput {...props} label="Anz. Personen" placeholder="Anz. Personen" />
              )}</UiForm.Field>
            </UiGrid.Col>
          </UiGrid>

          <UiForm.Field field={form.trailer}>{(props) => (
            <UiTextInput {...props} label="Anhänger" placeholder="Anhänger" />
          )}</UiForm.Field>

          <UiGrid gap={0.5}>
            <UiGrid.Col size={{ xs: 12, md: 6 }}>
              <UiForm.Field field={form.pointOfDeparture}>{(props) => (
                <UiTextInput {...props} label="Abfahrtsort" placeholder="Abfahrtsort" />
              )}</UiForm.Field>
            </UiGrid.Col>
            <UiGrid.Col size={{ xs: 12, md: 6 }}>

              <UiForm.Field field={form.pointOfArrival}>{(props) => (
                <UiTextInput {...props} label="Ankunftsort" placeholder="Ankunftsort" />
              )}</UiForm.Field>
            </UiGrid.Col>
          </UiGrid>
          <UiForm.Field field={form.assigneeId}>{(props) => (
            <UiSelectInput
              {...props}
              label="Zuweisung"
              options={userIds}
              optionName={mapUserIdToName}
              menuPlacement="top"
            />
          )}</UiForm.Field>

          <UiGrid gap={0.5}>
            <UiGrid.Col size={{ xs: 12, md: 6 }}>
              <UiForm.Field field={form.startsAt}>{(props) => (
                <UiDateInput {...props} label="Beginn" placeholder="dd.mm.yyyy hh:mm" />
              )}</UiForm.Field>
            </UiGrid.Col>
            <UiGrid.Col size={{ xs: 12, md: 6 }}>

              <UiForm.Field field={form.endsAt}>{(props) => (
                <UiDateInput {...props} label="Ende" placeholder="dd.mm.yyyy hh:mm" />
              )}</UiForm.Field>
            </UiGrid.Col>
          </UiGrid>
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
