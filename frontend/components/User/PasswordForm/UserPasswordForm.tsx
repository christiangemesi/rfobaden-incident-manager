import React from 'react'
import User, { parseUser } from '@/models/User'
import { clearForm, useForm, useValidate } from '@/components/Ui/Form'
import UiForm from '@/components/Ui/Form/UiForm'
import UiTextInput from '@/components/Ui/Input/Text/UiTextInput'
import BackendService from '@/services/BackendService'
import { SessionResponse } from '@/models/Session'
import SessionStore from '@/stores/SessionStore'

interface Props {
  user: User
  onClose?: () => void
}

const UserPasswordForm: React.VFC<Props> = ({ user, onClose: handleClose }) => {
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

  const handleSubmit = async (formData: FormData) => {
    const [data, error] = await BackendService.update<FormData, SessionResponse>(`users/${user.id}/password`, formData)
    if (error !== null) {
      throw error
    }
    SessionStore.setSession(data.token, parseUser(data.user))
    clearForm(form)
    if (handleClose) {
      handleClose()
    }
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
          onCancel={handleClose}
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