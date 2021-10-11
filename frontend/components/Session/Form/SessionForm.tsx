import React from 'react'
import User from '@/models/User'
import UiForm, { useForm, useValidate } from '@/components/Ui/Form/UiForm'
import UiTextInput from '@/components/Ui/Input/Text/UiTextInput'
import UiConfirmButtons from '@/components/Ui/Confirm/Buttons/UiConfirmButtons'
import BackendService, { BackendResponse } from '@/services/BackendService'
import Id from '@/models/base/Id'
import SessionStore from '@/stores/SessionStore'

const SessionForm: React.VFC = () => {
  const [data, form] = useForm<LoginData>(() => ({
    username: '',
    password: '',
  }))
  useValidate(form, (validate) => ({
    username: [
      validate.notBlank(),
    ],
    password: [
      validate.notBlank(),
    ],
  }))

  const handleSubmit = async () => {
    // TODO correct api type
    // TODO error handling
    const [res, error]: BackendResponse<{ id: Id<User>, username: string }> = await BackendService.create('session', {
      username: data.username,
      password: data.password,
      isPersistent: true,
    })
    if (error !== null) {
      if (error.status === 401) {
        UiForm.set(form.password, '')
        UiForm.setErrors(form.password, ['ist nicht korrekt'])
        return
      }
      throw error
    }
    SessionStore.setCurrentUser({
      id: res.id,
      name: res.username,
    })
  }
  const handleCancel = () => {
    UiForm.clear(form)
  }

  return (
    <div>
      <h1>
        Anmeldung
      </h1>
      <form>
        <UiForm.Field field={form.username}>{(props) => (
          <UiTextInput {...props} label="Name" />
        )}</UiForm.Field>
        <UiForm.Field field={form.password}>{(props) => (
          <UiTextInput {...props} label="Passwort" type="password" />
        )}</UiForm.Field>
        <UiConfirmButtons
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </form>
    </div>
  )
}
export default SessionForm

interface LoginData {
  username: string
  password: string
}
