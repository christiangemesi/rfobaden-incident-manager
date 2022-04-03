import Incident, {} from '@/models/Incident'
import FileUpload, { FileId } from '@/models/FileUpload'
import { clearForm, setFormField, useCancel, useForm, useSubmit } from '@/components/Ui/Form'
import React, { useEffect } from 'react'
import UiTextInput from '@/components/Ui/Input/Text/UiTextInput'
import UiForm from '@/components/Ui/Form/UiForm'
import styled from 'styled-components'
import FileInput from '@/components/Ui/Input/File/FileInput'
import { useValidate } from '@/components/Ui/Form/validate'
import Id from '@/models/base/Id'
import Report from '@/models/Report'
import Task from '@/models/Task'
import BackendService, { BackendResponse } from '@/services/BackendService'

interface Props {
  modelId: Id<Incident | Report | Task>
  modelName: 'incident' | 'report' | 'task'
  onClose?: () => void
  onSave: (fileId: FileId) => void
}

const FileUploadForm: React.VFC<Props> = ({
  modelId,
  modelName,
  onClose: handleClose,
  onSave: handleSave,
}) => {
  const form = useForm<FileUpload>(() => ({
    title: '',
    file: null,
  }))

  useValidate(form, (validate) => ({
    title: [
      validate.notBlank(),
      validate.match(/^[A-Za-z0-9_\-.]+$/, { message: 'ist kein gültiger Dateiname' }),
      (value) => !/^\.+$/.test(value) || 'ist kein gültiger Dateiname',
    ],
    file: [
      validate.notNull(),
    ],
  }))

  useSubmit(form, async (fileUpload: FileUpload) => {
    const [fileId, error] = await BackendService.create<FileUpload, FileId>('images', fileUpload)
    if (error !== null) {
      throw error
    }
    handleSave(fileId)

    clearForm(form)
    if (handleClose) {
      handleClose()
    }
  })
  useCancel(form, handleClose)

  useEffect(() => {
    if (form.file.value === null || form.title.hasChanged) {
      return
    }
    setFormField(form.title, { value: form.file.value.name })
  }, [form.file.value, form.title])

  return (
    <UiForm form={form}>
      <FormContainer>
        <UiForm.Field field={form.file}>{(props) => (
          <FileInput {...props} accept="image/*" />
        )}</UiForm.Field>
        <UiForm.Field field={form.title}>{(props) => (
          <UiTextInput {...props} label="Titel" />
        )}</UiForm.Field>
        <UiForm.Buttons form={form} />
      </FormContainer>
    </UiForm>
  )
}

export default FileUploadForm

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`