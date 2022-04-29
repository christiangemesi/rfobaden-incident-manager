import React from 'react'
import UiTextInput from '@/components/Ui/Input/Text/UiTextInput'
import BackendService, { BackendResponse } from '@/services/BackendService'
import { clearForm, useCancel, useForm, useSubmit } from '@/components/Ui/Form'
import UiForm from '@/components/Ui/Form/UiForm'
import { ModelData } from '@/models/base/Model'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import { useValidate } from '@/components/Ui/Form/validate'
import OrganizationStore from '@/stores/OrganizationStore'
import Organization, { parseOrganization } from '@/models/Organization'

interface Props {
  organization?: Organization | null
  onClose?: () => void
}

const OrganizationForm: React.VFC<Props> = ({ organization = null, onClose: handleClose }) => {
  const form = useForm<ModelData<Organization>>(organization, () => ({
    name: '',
    userIds: [],
  }))

  useValidate(form, (validate) => ({
    name: [
      validate.notBlank(),
      validate.maxLength(100),
    ],
    userIds: [],
  }))

  useSubmit(form, async (formData: ModelData<Organization>) => {
    const [data, error]: BackendResponse<Organization> = organization === null
      ? await BackendService.create('organizations', formData)
      : await BackendService.update('organizations', organization.id, formData)
    if (error !== null) {
      throw error
    }
    OrganizationStore.save(parseOrganization(data))
    clearForm(form)
    if (handleClose) {
      handleClose()
    }
  })
  useCancel(form, handleClose)

  return (
    <UiForm form={form}>
      <UiGrid gap={1}>
        <UiGrid.Col size={{ xs: 12, md: 6 }}>
          <UiForm.Field field={form.name}>{(props) => (
            <UiTextInput {...props} label="Organisation" />
          )}</UiForm.Field>
        </UiGrid.Col>
      </UiGrid>
      <UiForm.Buttons form={form} />
    </UiForm>
  )
}
export default OrganizationForm