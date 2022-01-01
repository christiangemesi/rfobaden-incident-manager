import React from 'react'
import User, { parseUser, UserRole } from '@/models/User'
import UiTextInput from '@/components/Ui/Input/Text/UiTextInput'
import BackendService from '@/services/BackendService'
import UserStore, { useUsers } from '@/stores/UserStore'
import { clearForm, useForm, useSubmit } from '@/components/Ui/Form'
import UiForm from '@/components/Ui/Form/UiForm'
import { ModelData } from '@/models/base/Model'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiSelectInput from '@/components/Ui/Input/Select/UiSelectInput'
import { useValidate } from '@/components/Ui/Form/validate'
import OrganizationStore, { useOrganizations } from '@/stores/OrganizationStore'
import Id from '@/models/base/Id'
import Organization from '@/models/Organization'

const UserForm: React.VFC = () => {
  const form = useForm<ModelData<User>>(() => ({
    email: '',
    firstName: '',
    lastName: '',
    role: UserRole.ADMIN,
    organizationId: -1,
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
    const [data] = await BackendService.create<User>('users', formData)
    UserStore.save(parseUser(data))
    clearForm(form)
  })

  const organizations = useOrganizations((organizations) => organizations.map(({ id }) => id))
  return (
    <div>
      <form>
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
          <UiSelectInput {...props} label="Organisation" options={organizations} optionName={mapOrganizationIdToName} />
        )}</UiForm.Field>
        <UiForm.Buttons form={form} />
      </form>
    </div>
  )
}
export default UserForm

const mapOrganizationIdToName = (id: Id<Organization>): string | null => {
  const organization = OrganizationStore.find(id)
  return organization === null
    ? null
    : `${organization.name}`
}