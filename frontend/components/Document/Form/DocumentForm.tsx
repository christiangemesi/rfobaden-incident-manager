import Incident from '@/models/Incident'
import Document from '@/models/Document'
import { clearForm, useCancel, useForm, useSubmit } from '@/components/Ui/Form'
import React from 'react'
import UiTextInput from '@/components/Ui/Input/Text/UiTextInput'
import UiForm from '@/components/Ui/Form/UiForm'
import styled from 'styled-components'
import FileInput from '@/components/Ui/Input/File/FileInput'
import { useValidate } from '@/components/Ui/Form/validate'
import Id from '@/models/base/Id'
import Report from '@/models/Report'
import Task from '@/models/Task'
import BackendService from '@/services/BackendService'
import FileUpload from '@/models/FileUpload'

interface Props {
  /**
   * The {@link Id} of the {@link Model} to which the document belong.
   */
  modelId: Id<Incident | Report | Task>

  /**
   * The name of the {@link Model} to which the document belong.
   */
  modelName: 'incident' | 'report' | 'task' | 'subtask'

  /**
   * The type of the {@link Document}, determines how it is stored and displayed.
   */
  type: 'image' | 'document'

  /**
   * Event caused by closing the form.
   */
  onClose?: () => void

  /**
   * Event caused by saving the {@link Document}.
   */
  onSave: (document: Document) => void
}

/**
 * `DocumentForm` allows the creation of new {@link Document documents and images}.
 */
const DocumentForm: React.VFC<Props> = ({
  modelId,
  modelName,
  type,
  onClose: handleClose,
  onSave: handleSave,
}) => {
  const form = useForm<FileUpload>(() => ({
    name: null,
    file: null as unknown as File,
  }))

  useValidate(form, (validate) => ({
    name: [
      validate.notBlank({ allowNull: true }),
      validate.match(/^[ A-Za-z0-9_\-.]+$/, { message: 'ist kein gültiger Dateiname' }),
      (value) => value === null || !/^\.+$/.test(value) || 'ist kein gültiger Dateiname',
    ],
    file: [
      validate.notNull(),
      // Maximum upload size is 10MB.
      (value) => value === null || value.size < 10_000_000 || 'ist zu gross',
    ],
  }))

  useSubmit(form, async ({ file, name }: FileUpload) => {
    const [document, error] = await BackendService.upload('documents', file, {
      modelId: modelId.toString(),
      modelName,
      name,
      type: type,
    })
    if (error !== null) {
      throw error
    }

    handleSave(document)

    clearForm(form)
    if (handleClose) {
      handleClose()
    }
  })
  useCancel(form, handleClose)

  const fileNameArray = form.file.value?.name
    .split('.')
    .slice() ?? ['']
  fileNameArray.splice(-1, 1)
  const fileName = fileNameArray.join('.')

  return (
    <UiForm form={form}>
      <FormContainer>
        <UiForm.Field field={form.file}>{(props) => (
          <FileInput {...props} accept={type === 'image' ? 'image/*' : ''} />
        )}</UiForm.Field>
        <UiForm.Field field={form.name} deps={[fileName]}>{(props) => (
          <UiTextInput {...props} label="Name" placeholder={fileName} />
        )}</UiForm.Field>
        <UiForm.Buttons form={form} />
      </FormContainer>
    </UiForm>
  )
}

export default DocumentForm

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`
