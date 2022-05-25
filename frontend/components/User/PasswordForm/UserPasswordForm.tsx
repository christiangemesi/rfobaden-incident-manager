import React from 'react'
import User, { parseUser } from '@/models/User'
import { clearForm, useCancel, useForm, useSubmit } from '@/components/Ui/Form'
import UiForm from '@/components/Ui/Form/UiForm'
import UiTextInput from '@/components/Ui/Input/Text/UiTextInput'
import BackendService from '@/services/BackendService'
import SessionStore from '@/stores/SessionStore'
import { useValidate } from '@/components/Ui/Form/validate'

interface Props {

  /**
   * The {@link User} to be displayed.
   */
  user: User

  /**
   * Event caused by closing the form.
   */
  onClose?: () => void
}

/**
 * `UserPasswordForm` displays a form to edit the password of a {@link User}.
 */
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

  useSubmit(form, async (formData: FormData) => {
    const [data, error] = await BackendService.update<FormData, User>(`users/${user.id}/password`, formData)
    if (error !== null) {
      throw error
    }
    SessionStore.setCurrentUser(parseUser(data))
    clearForm(form)
    if (handleClose) {
      handleClose()
    }
  })

  useCancel(form, handleClose)

  return (
    <div>
      <UiForm form={form}>
        <UiForm.Field field={form.password}>{(props) => (
          <UiTextInput {...props} label="Passwort" type="password" />
        )}</UiForm.Field>
        <UiForm.Field field={form.passwordRepeat}>{(props) => (
          <UiTextInput {...props} label="Passwort wiederholen" type="password" />
        )}</UiForm.Field>
        <UiForm.Buttons form={form} />
      </UiForm>
    </div>
  )
}
export default UserPasswordForm

interface FormData {
  password: string
  passwordRepeat: string
}