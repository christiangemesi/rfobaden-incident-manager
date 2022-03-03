import React from 'react'
import User, { parseUser, UserRole } from '@/models/User'
import UiTextInput from '@/components/Ui/Input/Text/UiTextInput'
import BackendService from '@/services/BackendService'
import UserStore from '@/stores/UserStore'
import { clearForm, useForm, useSubmit } from '@/components/Ui/Form'
import UiForm from '@/components/Ui/Form/UiForm'
import { ModelData } from '@/models/base/Model'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiSelectInput from '@/components/Ui/Input/Select/UiSelectInput'
import { useValidate } from '@/components/Ui/Form/validate'
import OrganizationStore, { useOrganizations } from '@/stores/OrganizationStore'
import Id from '@/models/base/Id'
import Organization from '@/models/Organization'
import Incident from '@/models/Incident'

interface Props {
  user?: User | null
  onClose?: () => void
}

const UserCreateForm: React.VFC<Props> = ({ user = null, onClose: handleClose }) => {
  const form = useForm<ModelData<User>>(() => ({
    email: '',
    firstName: '',
    lastName: '',
    role: UserRole.ADMIN,
    organizationId: null,
  }))

  useValidate(form, (validate) => ({
    email: [
      validate.notBlank(),
      validate.match(/^\S+@\S+\.\S+$/, { message: 'muss eine gültige E-Mail-Adresse sein' }),
    ],
    firstName: [
      validate.notBlank(),
    ],
    lastName: [
      validate.notBlank(),
    ],
    role: [],
    organizationId: [],
  }))

  useSubmit(form, async (formData: ModelData<User>) => {
    const [data, error] = await BackendService.create<User>('users', formData)
    if (error !== null) {
      throw error
    }
    UserStore.save(parseUser(data))
    clearForm(form)

  })

  const organizationIds = useOrganizations((organizations) => organizations.map(({ id }) => id))
  return (
    <div>
      <UiForm form={form}>
        <UiGrid gap={1}>
          <UiGrid.Col size={{ xs: 12, md: 6 }}>
            <UiForm.Field field={form.firstName}>{(props) => (
              <UiTextInput {...props} label="Vorname" />
            )}</UiForm.Field>
          </UiGrid.Col>
          <UiGrid.Col>
            <UiForm.Field field={form.lastName}>{(props) => (
              <UiTextInput {...props} label="Nachname" />
            )}</UiForm.Field>
          </UiGrid.Col>
        </UiGrid>
        <UiForm.Field field={form.email}>{(props) => (
          <UiTextInput {...props} label="E-Mail" />
        )}</UiForm.Field>
        <UiForm.Field field={form.role}>{(props) => (
          <UiSelectInput {...props} label="Rolle" options={Object.values(UserRole)} />
        )}</UiForm.Field>
        <UiForm.Field field={form.organizationId}>{(props) => (
          <UiSelectInput {...props} label="Organisation" options={organizationIds} optionName={mapOrganizationIdToName} />
        )}</UiForm.Field>
        <UiForm.Buttons form={form} />
      </UiForm>
    </div>
  )
}
export default UserCreateForm

const mapOrganizationIdToName = (id: Id<Organization>): string | null => {
  const organization = OrganizationStore.find(id)
  return organization === null
    ? null
    : `${organization.name}`
}