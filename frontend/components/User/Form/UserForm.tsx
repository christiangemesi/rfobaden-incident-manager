import React from 'react'
import User from '@/models/User'
import UiForm, { useForm, useValidate } from '@/components/Ui/Form/UiForm'
import UiTextInput from '@/components/Ui/Input/Text/UiTextInput'
import UiConfirmButtons from '@/components/Ui/Confirm/Buttons/UiConfirmButtons'
import BackendService from '@/services/BackendService'
import Id from '@/models/base/Id'

const UserForm: React.VFC = () => {
  const [data, form] = useForm<LoginData>(() => ({
    username: '',
    password: '',
    passwordRepeat: '',
  }))
  useValidate(form, (validate) => ({
    username: [
      validate.notBlank(),
    ],
    password: [
      validate.notBlank(),
    ],
    passwordRepeat: [
      validate.notBlank(),
      (value, data) => value === data.password || 'muss mit Passwort übereinstimmen',
    ],
  }))

  const handleSubmit = async () => {
    // TODO correct api type
    // TODO error handling
    const res: { id: Id<User>, username: string } = await BackendService.create({
      username: data.username,
      password: data.password,
    })
    const user: User = {
      id: res.id,
      name: res.username,
    }
    console.log(user)
  }
  const handleCancel = () => {
    UiForm.clear(form)
  }

  return (
    <div>
      <h1>
        Benutzer erstellen
      </h1>
      <form>
        <UiForm.Field field={form.username}>{(props) => (
          <UiTextInput {...props} label="Name" />
        )}</UiForm.Field>
        <UiForm.Field field={form.password}>{(props) => (
          <UiTextInput {...props} label="Passwort" type="password" />
        )}</UiForm.Field>
        <UiForm.Field field={form.passwordRepeat}>{(props) => (
          <UiTextInput {...props} label="Passwort wiederholen" type="password" />
        )}</UiForm.Field>

        <UiConfirmButtons
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </form>
    </div>
  )
}
export default UserForm

interface LoginData {
  username: string
  password: string
  passwordRepeat: string
}
