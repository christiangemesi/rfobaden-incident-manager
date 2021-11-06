import React from 'react'
import { clearForm, useForm, useValidate } from '@/components/Ui/Form'
import { ModelData } from '@/models/base/Model'
import Report, { parseReport } from '@/models/Report'
import BackendService, { BackendResponse } from '@/services/BackendService'
import IncidentStore from '@/stores/IncidentStore'
import UiForm from '@/components/Ui/Form/UiForm'
import UiTextInput from '@/components/Ui/Input/Text/UiTextInput'

const ReportForm: React.VFC = () => {
  const form = useForm<ModelData<Report>>(() => ({
    title: '',
    description: null,
    authorId: -1,
    closeReason: null,
    isClosed: false,
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
    isClosed: [],
    endsAt: [],
  }))

  const handleSubmit = async (reportData: ModelData<Report>) => {
    // TODO correct api type
    // TODO error handling
    const [data]: BackendResponse<Report> = await BackendService.create('reports', reportData)

    const report = parseReport(data)
    IncidentStore.save(report)
    clearForm(form)
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
export default ReportForm