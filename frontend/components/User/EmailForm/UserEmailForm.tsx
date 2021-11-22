import React from 'react'
import User, { parseUser } from '@/models/User'
import { clearForm, useForm, useValidate } from '@/components/Ui/Form'
import UiForm from '@/components/Ui/Form/UiForm'
import UiTextInput from '@/components/Ui/Input/Text/UiTextInput'
import BackendService from '@/services/BackendService'
import { SessionResponse } from '@/models/Session'
import UserStore from '@/stores/UserStore'
import { UpdateData } from '@/models/base/Model'
import SessionStore, { getSessionToken } from '@/stores/SessionStore'

interface Props {
  user: User
  onClose?: () => void
}

const UserEmailForm: React.VFC<Props> = ({ user, onClose: handleClose }) => {
  const form = useForm<FormData>(() => ({
    email: user.email,
  }))
  useValidate(form, (validate) => ({
    email: [
      validate.notBlank(),
      validate.match(/.+@.+\..+/, { message: 'muss eine gültige E-Mail-Adresse sein' }),
    ],
  }))

  const handleSubmit = async (formData: FormData) => {
    const [data, error] = await BackendService.update<UpdateData<User>, SessionResponse>(`users/${user.id}`, {
      ...user,
      ...formData,
    })
    if (error !== null) {
      throw error
    }
    SessionStore.setCurrentUser(parseUser(data))
    clearForm(form)
    if (handleClose) {
      handleClose()
    }
  }

  return (
    <div>
      <form>
        <UiForm.Field field={form.email}>{(props) => (
          <UiTextInput {...props} label="E-Mail" />
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
export default UserEmailForm

interface FormData {
  email: string
}
