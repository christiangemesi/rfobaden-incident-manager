import Incident, { parseIncident } from '@/models/Incident'
import FileUpload from '@/models/FileUpload'
import { clearForm, useForm, useSubmit } from '@/components/Ui/Form'
import React from 'react'
import UiTextInput from '@/components/Ui/Input/Text/UiTextInput'
import UiForm from '@/components/Ui/Form/UiForm'
import styled from 'styled-components'
import FileInput from '@/components/Ui/Input/FileInput'
import { useValidate } from '@/components/Ui/Form/validate'
import { ModelData } from '@/models/base/Model'
import BackendService, { BackendResponse } from '@/services/BackendService'
import IncidentStore from '@/stores/IncidentStore'


interface Props {
  incident?: Incident | null
  onClose?: () => void

}

const IncidentFileUploadForm: React.VFC<Props> = ({ onClose: handleClose }) => {
  const form = useForm<FileUpload>( () => ({
    title: '',
    file: null,
  }))

  useValidate(form, (validate) => ({
    title: [
      validate.notBlank(),
    ],
    file: [
      validate.notNull(),
    ],
  }))

  useSubmit(form, async (fileUpload: FileUpload) => {
    console.log(fileUpload)
  })

  return (
    <UiForm form={form}>
      <FormContainer>
        <UiForm.Field field={form.title}>{(props) => (
          <UiTextInput {...props} label="Titel" />
        )}</UiForm.Field>

        <UiForm.Field field={form.file}>{(props) => (
          <FileInput {...props} label="Titel" />
        )}</UiForm.Field>

        <UiForm.Buttons form={form} />
      </FormContainer>
    </UiForm>
  )
}

export default IncidentFileUploadForm

const FormContainer = styled.div`
  display: flex;  
  flex-direction: column;
  gap: 0.5rem;
`