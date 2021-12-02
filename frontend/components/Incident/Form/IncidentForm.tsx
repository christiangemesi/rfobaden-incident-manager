import React from 'react'
import { clearForm, useCancel, useForm, useSubmit } from '@/components/Ui/Form'
import BackendService, { BackendResponse } from '@/services/BackendService'
import IncidentStore from '@/stores/IncidentStore'
import UiForm from '@/components/Ui/Form/UiForm'
import UiTextInput from '@/components/Ui/Input/Text/UiTextInput'
import Incident, { parseIncident } from '@/models/Incident'
import { ModelData } from '@/models/base/Model'
import { useValidate } from '@/components/Ui/Form/validate'
import UiModal from '@/components/Ui/Modal/UiModal'
import UiButton from '@/components/Ui/Button/UiButton'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UiContainer from '@/components/Ui/Container/UiContainer'
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

    <UiModal isFull>
      <UiModal.Activator>{({ open }) => (
        <UiButton onClick={open}>
          Ereignis erstellen
        </UiButton>
      )}</UiModal.Activator>
      <UiModal.Body>{({ close }) => (
        <UiContainer>
          <UiTitle level={1}>Ereignis erstellen</UiTitle>

          <form>
            <UiGrid gap={0.5}>
              <UiGrid.Col size={12}>
                <UiForm.Field field={form.description}>{(props) => (
                  <UiTextInput {...props} label="Titel" placeholder="Titel" />
                )}</UiForm.Field>
              </UiGrid.Col>

              <UiGrid.Col size={12}>
                <UiForm.Field field={form.description}>{(props) => (
                  <UiTextArea {...props} label="Beschreibung" placeholder="Beschreibung" />
                )}</UiForm.Field>
              </UiGrid.Col>

              <UiGrid.Col>
                <UiForm.Field field={form.description}>{(props) => (
                  <UiTextInput {...props} label="Start Datum" placeholder="Start Datum">
                    <UiIcon.Organization />
                  </UiTextInput>
                )}</UiForm.Field>
              </UiGrid.Col>

              <UiGrid.Col>
                <UiForm.Field field={form.description}>{(props) => (
                  <UiTextInput {...props} label="End Datum" placeholder="End Datum">
                    <UiIcon.Organization />
                  </UiTextInput>
                )}</UiForm.Field>
              </UiGrid.Col>

            </UiGrid>

            <UiForm.Buttons form={form} />
          </form>

        </UiContainer>

      )}</UiModal.Body>
    </UiModal>
  )
}

export default IncidentForm
