import React from 'react'
import { useForm, useValidate } from '@/components/Ui/Form'
import BackendService, { BackendResponse } from '@/services/BackendService'
import Incident, { parseDateOrNull } from '@/models/Incident'
import IncidentStore from '@/stores/IncidentStore'
import UiForm from '@/components/Ui/Form/UiForm'
import UiTextInput from '@/components/Ui/Input/Text/UiTextInput'
import { parseDate } from '@/models/Date'

const IncidentForm: React.VFC = () => {
  const form = useForm<IncidentData>(() => ({
    title: '',
    description: '',
    startsAt: '',
  }))

  useValidate(form, (validate) => ({
    title: [
      validate.notBlank(),
    ],
    description: [
      // TODO: No validation yet
    ],
    startsAt: [
      // TODO: No validation yet
    ],
  }))

  const handleSubmit = async (data: IncidentData) => {
    // TODO correct api type
    // TODO error handling
    const [res]: BackendResponse<Incident> = await BackendService.create('incidents', {
      title: data.title,
      description: data.description,
      startsAt: new Date('' + data.startsAt),

      // TODO: make authorId dynamic
      authorId: 1,
    })

    const incident: Incident = {
      id: res.id,
      title: res.title,
      description: res.description,
      authorId: res.authorId,
      closeReason: res.closeReason,
      isClosed: res.isClosed,
      createdAt: parseDate(res.createdAt),
      updatedAt: parseDate(res.updatedAt),
      startsAt: parseDateOrNull(res.startsAt),
      endsAt: parseDateOrNull(res.endsAt),
    }
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
        <UiForm.Field field={form.startsAt}>{(props) => (
          <UiTextInput {...props} label="Start Datum (2019-01-16)"/>
        )}</UiForm.Field>
        <UiForm.Buttons form={form} onSubmit={handleSubmit}/>
      </form>
    </div>
  )
}

export default IncidentForm

interface IncidentData {
  title: string
  description: string
  startsAt: string
}