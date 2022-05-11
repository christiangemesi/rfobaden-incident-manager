import React, { useMemo } from 'react'
import User, { parseUser, UserRole } from '@/models/User'
import UiTextInput from '@/components/Ui/Input/Text/UiTextInput'
import BackendService, { BackendResponse } from '@/services/BackendService'
import UserStore, { useUsers } from '@/stores/UserStore'
import { clearForm, useCancel, useForm, useSubmit } from '@/components/Ui/Form'
import UiForm from '@/components/Ui/Form/UiForm'
import { ModelData } from '@/models/base/Model'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiSelectInput from '@/components/Ui/Input/Select/UiSelectInput'
import { useValidate } from '@/components/Ui/Form/validate'
import OrganizationStore, { useOrganizations } from '@/stores/OrganizationStore'
import Id from '@/models/base/Id'
import Organization from '@/models/Organization'

interface Props {
  user?: User | null
  onClose?: () => void
}

const UserForm: React.VFC<Props> = ({ user = null, onClose: handleClose }) => {

  const users = useUsers()
  const userEmails = useMemo(() => (
    users.map(({ email }) => email.toLowerCase())
  ), [users])

  const form = useForm<ModelData<User>>(user,() => ({
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
      validate.maxLength(100),
      (value) => userEmails.find((email) => email === value.toLowerCase()) === undefined || 'E-Mail-Adresse wird schon benutzt' ,
    ],
    firstName: [
      validate.notBlank(),
      validate.maxLength(100),
    ],
    lastName: [
      validate.notBlank(),
      validate.maxLength(100),
    ],
    role: [],
    organizationId: [],
  }))

  useSubmit(form, async (formData: ModelData<User>) => {
    const [data, error]: BackendResponse<User> = user === null
      ? await BackendService.create('users', formData)
      : await BackendService.update('users', user.id, formData)
    if (error !== null) {
      throw error
    }
    UserStore.save(parseUser(data))
    clearForm(form)
    if (handleClose) {
      handleClose()
    }
  })
  useCancel(form, handleClose)

  const organizations = useOrganizations()
  const organizationIds = useMemo(() => organizations.map(({ id }) => id), [organizations])

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
export default UserForm

const mapOrganizationIdToName = (id: Id<Organization>): string | null => {
  const organization = OrganizationStore.find(id)
  return organization === null
    ? null
    : `${organization.name}`
}
