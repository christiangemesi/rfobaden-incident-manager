import React from 'react'
import User, { parseUser } from '@/models/User'
import { clearForm, useCancel, useForm, useSubmit } from '@/components/Ui/Form'
import UiForm from '@/components/Ui/Form/UiForm'
import UiTextInput from '@/components/Ui/Input/Text/UiTextInput'
import BackendService from '@/services/BackendService'
import { SessionResponse } from '@/models/Session'
import { UpdateData } from '@/models/base/Model'
import SessionStore from '@/stores/SessionStore'
import { useValidate } from '@/components/Ui/Form/validate'

interface Props {

  /**
   * The user whose email gets edited.
   */
  user: User

  /**
   * Event caused by closing the form.
   */
  onClose?: () => void
}

/**
 * `UserEmailForm` displays a form to edit the email of a {@link User}.
 */
const UserEmailForm: React.VFC<Props> = ({ user, onClose: handleClose }) => {
  const form = useForm<FormData>(() => ({
    email: user.email,
  }))
  useValidate(form, (validate) => ({
    email: [
      validate.notBlank(),
      validate.match(/^\S+@\S+\.\S+$/, { message: 'muss eine gültige E-Mail-Adresse sein' }),
    ],
  }))

  useSubmit(form, async (formData: FormData) => {
    const [data, error] = await BackendService.update<UpdateData<User>, SessionResponse>(`users/${user.id}`, {
      ...user,
      ...formData,
    })
    if (error !== null) {
      throw error
    }
    if (data.user == null) {
      throw new Error('user was successfully updated, but we did not receive user')
    }
    SessionStore.setCurrentUser(parseUser(data.user))
    clearForm(form)
    if (handleClose) {
      handleClose()
    }
  })

  useCancel(form, handleClose)

  return (
    <div>
      <UiForm form={form}>
        <UiForm.Field field={form.email}>{(props) => (
          <UiTextInput {...props} label="E-Mail" />
        )}</UiForm.Field>
        <UiForm.Buttons form={form} />
      </UiForm>
    </div>
  )
}
export default UserEmailForm

interface FormData {
  email: string
}
