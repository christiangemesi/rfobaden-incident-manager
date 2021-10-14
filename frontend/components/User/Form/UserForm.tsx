import React from 'react'
import User from '@/models/User'
import UiTextInput from '@/components/Ui/Input/Text/UiTextInput'
import BackendService, { BackendResponse } from '@/services/BackendService'
import Id from '@/models/base/Id'
import UserStore from '@/stores/UserStore'
import { useForm, useValidate } from '@/components/Ui/Form'
import UiForm from '@/components/Ui/Form/UiForm'

const UserForm: React.VFC = () => {
  const form = useForm<LoginData>(() => ({
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

  const handleSubmit = async (data: LoginData) => {
    // TODO correct api type
    // TODO error handling
    const [res]: BackendResponse<{ id: Id<User>, username: string }> = await BackendService.create('users', {
      username: data.username,
      password: data.password,
    })
    const user: User = {
      id: res.id,
      name: res.username,
    }
    UserStore.save(user)
  }

  return (
    <div>
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
        <UiForm.Buttons form={form} onSubmit={handleSubmit} />
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
