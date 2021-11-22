import React from 'react'
import { clearForm, useForm, useValidate } from '@/components/Ui/Form'
import { ModelData } from '@/models/base/Model'
import Report, { parseReport, ReportPriority } from '@/models/Report'
import BackendService, { BackendResponse } from '@/services/BackendService'
import UiForm from '@/components/Ui/Form/UiForm'
import UiTextInput from '@/components/Ui/Input/Text/UiTextInput'
import ReportStore from '@/stores/ReportStore'
import UiSelectInput from '@/components/Ui/Input/Select/UiSelectInput'



const ReportForm: React.VFC = () => {
  const form = useForm<ModelData<Report>>(() => ({
    id: -1,
    authorId: -1,
    assignee: -1,
    //TODO get parrent incident incident: new parentIncident,
    title: '',
    description: '',
    addendum: '',
    startsAt: null,
    updatedAt: new Date(),
    endsAt: null,
    completion: -1,
    isComplete: false,
    location: '',
    priority: '',
  }))

  useValidate(form, (validate) => {
    return ({
      id: [],
      authorId: [],
      assignee: [],
      title: [
        validate.notBlank(),
      ],
      description: [
        validate.notBlank({ allowNull: true }),
      ],
      addendum: [],
      startsAt: [],
      updatedAt: [],
      endsAt: [],
      completion: [],
      isComplete: [],
      location: [],
      priority: [],
    })
  })

  const handleSubmit = async (reportData: ModelData<Report>) => {
    const [data]: BackendResponse<Report> = await BackendService.create('reports', reportData)

    const report = parseReport(data)
    ReportStore.save(report)
    clearForm(form)
  }

  return (
    <div>
      <form>
        <UiForm.Field field={form.title}>{(props) => (
          <UiTextInput {...props} label="Titel" />
        )}</UiForm.Field>
        <UiForm.Field field={form.description}>{(props) => (
          <UiTextInput {...props} label="Beschreibung" />
        )}</UiForm.Field>
        <UiForm.Field field={form.addendum}>{(props) => (
          <UiTextInput {...props} label="Addendum" />
        )}</UiForm.Field>
        <UiForm.Field field={form.location}>{(props) => (
          <UiTextInput {...props} label="Ort" />
        )}</UiForm.Field>
        <UiForm.Field field={form.priority}>{(props) => (
          <UiSelectInput {...props} label="Priorität" options={Object.values(ReportPriority)} />
        )}</UiForm.Field>
        <UiForm.Buttons form={form} onSubmit={handleSubmit} />
      </form>
    </div>
  )


}
export default ReportForm