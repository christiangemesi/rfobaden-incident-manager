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
    author: -1,
    assignee: -1,
    //TODO get parrent incident incident: new parentIncident,
    title: '',
    description: '',
    addendum: '',
    //TODO i dont know why new Date() sometimes works and sometimes it doesnt? :O
    startsAt: new Date(),
    updatedAt: new Date(),
    startsAt: new Date(),
    endsAt: new Date().setDate(Date.now()),
    completion: -1,
    isComplete: false,
    location: '',
    priority: '',
  }))

  useValidate(form, (validate) => {
    return ({
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
    })
  })

  const handleSubmit = async (reportData: ModelData<Report>) => {
    const [data]: BackendResponse<Report> = await BackendService.create('reports', reportData)

    const report = parseReport(data)
    ReportStore.save(report)
    clearForm(form)
  }

  //TODO should i add all fields from above?
  return (
    <div>
      <form>
        <UiForm.Field field={form.title}>{(props) => (
          <UiTextInput {...props} label="Titel" />
        )}</UiForm.Field>
        <UiForm.Field field={form.description}>{(props) => (
          <UiTextInput {...props} label="Beschreibung" />
        )}</UiForm.Field>
        <UiForm.Field field={form.adendum}>{(props) => (
          <UiTextInput {...props} label="Adendum" />
        )}</UiForm.Field>
        <UiForm.Field field={form.location}>{(props) => (
          <UiTextInput {...props} label="Ort" />
        )}</UiForm.Field>
        <UiForm.Field field={form.priority}>{(props) => (
          //TODO what do i pass into Object.values? like how to chose LOW,MEDIUM,HIGH?
          <UiSelectInput {...props} label="Priorität" options={Object.values(ReportPriority)} />
        )}</UiForm.Field>
        <UiForm.Buttons form={form} onSubmit={handleSubmit} />
      </form>
    </div>
  )


}
export default ReportForm