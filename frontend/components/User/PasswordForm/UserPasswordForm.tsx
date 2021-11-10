import React from 'react'
import User from '@/models/User'
import { useForm, useValidate } from '@/components/Ui/Form'
import UiForm from '@/components/Ui/Form/UiForm'
import UiTextInput from '@/components/Ui/Input/Text/UiTextInput'

interface Props {
  user: User
  onClose?: () => void
}

const UserPasswordForm: React.VFC<Props> = ({ user, onClose }) => {
  const form = useForm<FormData>(() => ({
    password: '',
    passwordRepeat: '',
  }))
  useValidate(form, (validate) => ({
    password: [
      validate.notBlank(),
    ],
    passwordRepeat: [
      (value, data) => value === data.password || 'muss mit Passwort übereinstimmen',
    ],
  }))

  const handleSubmit = (formData: FormData) => {
    // const [data] = await BackendService.create<User>('users', formData)
    // UserStore.save(parseUser(data))
    // clearForm(form)
  }

  return (
    <div>
      <form>
        <UiForm.Field field={form.password}>{(props) => (
          <UiTextInput {...props} label="Passwort" type="password" />
        )}</UiForm.Field>
        <UiForm.Field field={form.passwordRepeat}>{(props) => (
          <UiTextInput {...props} label="Passwort wiederholen" type="password" />
        )}</UiForm.Field>
        <UiForm.Buttons
          form={form}
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      </form>
    </div>
  )
}
export default UserPasswordForm

interface FormData {
  password: string
  passwordRepeat: string
}