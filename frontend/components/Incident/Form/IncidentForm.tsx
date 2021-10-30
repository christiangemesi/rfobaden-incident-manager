import React from 'react'
import { useForm, useValidate } from '@/components/Ui/Form'
import BackendService, { BackendResponse } from '@/services/BackendService'
import IncidentStore from '@/stores/IncidentStore'
import UiForm from '@/components/Ui/Form/UiForm'
import UiTextInput from '@/components/Ui/Input/Text/UiTextInput'
import Incident, { parseIncident } from '@/models/Incident'
import { ModelData } from '@/models/base/Model'

const IncidentForm: React.VFC = () => {
  const form = useForm<ModelData<Incident>>(() => ({
    title: '',
    description: '',
    authorId: -1,
    closeReason: null,
    isClosed: false,
    startsAt: null,
    createdAt: null,
    updatedAt: null,
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
    isClosed: [],
    createdAt: [],
    updatedAt: [],
    endsAt: [],
  }))

  const handleSubmit = async (incidentData: ModelData<Incident>) => {
    // TODO correct api type
    // TODO error handling
    const [data]: BackendResponse<Incident> = await BackendService.create('incidents', {
      title: incidentData.title,
      description: incidentData.description,

      // TODO: make authorId dynamic
      authorId: 1,
    })

    const incident = parseIncident(data)
    IncidentStore.save(incident)
  }

  return (
    <div>
      <form>
        <UiForm.Field field={form.title}>{(props) => (
          <UiTextInput {...props} label="Titel"/>
        )}</UiForm.Field>
        <UiForm.Field field={form.description}>{(props) => (
          <UiTextInput {...props} label="Beschreibung"/>
        )}</UiForm.Field>
        <UiForm.Buttons form={form} onSubmit={handleSubmit}/>
      </form>
    </div>
  )
}

export default IncidentForm