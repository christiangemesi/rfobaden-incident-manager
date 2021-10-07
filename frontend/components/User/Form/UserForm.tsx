import React from 'react'
import styled from 'styled-components'
import User from '@/models/User'
import UiForm, { useForm, useValidate } from '@/components/Ui/Form/UiForm'
import UiTextInput from '@/components/Ui/Input/Text/UiTextInput'
import UiConfirmButtons from '@/components/Ui/Confirm/Buttons/UiConfirmButtons'

const UserForm: React.VFC = () => {
  const [data, form] = useForm<CreateUserData>(() => ({
    name: '',
    password: '',
    passwordRepeat: '',
  }))
  useValidate(form, (validate) => ({
    name: [
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

  const handleSubmit = () => {
    console.log('submit', data)
  }
  const handleCancel = () => {
    console.log('cancel')
  }

  return (
    <div>
      <h1>
        Benutzer erstellen
      </h1>
      <form>
        <UiForm.Field field={form.name}>{(props) => (
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

const SubmitButton = styled.button`
  background-color: green;
  color: white;
  padding: 1rem 0.5rem;  
`

interface CreateUserData extends Omit<User, 'id'> {
  password: string
  passwordRepeat: string
}
