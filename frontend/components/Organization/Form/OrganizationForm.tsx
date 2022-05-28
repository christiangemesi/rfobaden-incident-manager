import React from 'react'
import UiTextInput from '@/components/Ui/Input/Text/UiTextInput'
import BackendService, { BackendResponse } from '@/services/BackendService'
import { clearForm, useCancel, useForm, useSubmit } from '@/components/Ui/Form'
import UiForm from '@/components/Ui/Form/UiForm'
import { ModelData } from '@/models/base/Model'
import { useValidate } from '@/components/Ui/Form/validate'
import OrganizationStore from '@/stores/OrganizationStore'
import Organization, { parseOrganization } from '@/models/Organization'

interface Props {

  /**
   * The {@link Organization} to edit, or `null`, if a new organization should be created.
   */
  organization?: Organization | null

  /**
   * Event caused by closing the form.
   */
  onClose?: () => void
}

/**
 * `OrganizationForm` displays a form to create and edit an {@link Organization}.
 */
const OrganizationForm: React.VFC<Props> = ({
  organization = null,
  onClose: handleClose,
}) => {
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
      <UiForm.Field field={form.name}>{(props) => (
        <UiTextInput {...props} label="Organisation" />
      )}</UiForm.Field>
      <UiForm.Buttons form={form} text={organization === null ? 'Erstellen' : 'Bearbeiten'} />
    </UiForm>
  )
}
export default OrganizationForm