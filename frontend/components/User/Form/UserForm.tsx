import React from 'react'
import User, { parseUser, UserRole } from '@/models/User'
import UiTextInput from '@/components/Ui/Input/Text/UiTextInput'
import BackendService, { BackendResponse } from '@/services/BackendService'
import Id from '@/models/base/Id'
import UserStore from '@/stores/UserStore'
import { clearForm, useForm, useValidate } from '@/components/Ui/Form'
import UiForm from '@/components/Ui/Form/UiForm'
import { ModelData } from '@/models/base/Model'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiSelectInput from '@/components/Ui/Input/Select/UiSelectInput'

const UserForm: React.VFC = () => {
  const form = useForm<ModelData<User>>(() => ({
    email: '',
    firstName: '',
    lastName: '',
    role: UserRole.ADMIN,
  }))
  useValidate(form, (validate) => ({
    email: [
      validate.notBlank(),
      validate.match(/.+@.+\..+/, { message: 'muss eine gültige E-Mail-Adresse sein' }),
    ],
    firstName: [
      validate.notBlank(),
    ],
    lastName: [
      validate.notBlank(),
    ],
    role: [],
  }))

  const handleSubmit = async (formData: ModelData<User>) => {
    const [data] = await BackendService.create<User>('users', formData)
    UserStore.save(parseUser(data))
    clearForm(form)
  }

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
        <UiForm.Buttons form={form} onSubmit={handleSubmit} />
      </form>
    </div>
  )
}
export default UserForm
