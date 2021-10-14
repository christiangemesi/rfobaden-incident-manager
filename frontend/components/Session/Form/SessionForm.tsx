import React, { useEffect } from 'react'
import User from '@/models/User'
import UiTextInput from '@/components/Ui/Input/Text/UiTextInput'
import BackendService, { BackendResponse } from '@/services/BackendService'
import Id from '@/models/base/Id'
import SessionStore, { useSession } from '@/stores/SessionStore'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { setFormField, useForm, useValidate } from '@/components/Ui/Form'
import UiForm from '@/components/Ui/Form/UiForm'

const SessionForm: React.VFC = () => {
  const form = useForm<LoginData>(() => ({
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

  const router = useRouter()
  const { currentUser } = useSession()
  useEffect(() => {
    if (currentUser !== null) {
      router.push('/')
    }
  }, [router, currentUser])

  const handleSubmit = async (data: LoginData) => {
    // TODO correct api type
    // TODO error handling
    const [res, error]: BackendResponse<{ id: Id<User>, username: string }> = await BackendService.create('session', {
      username: data.username,
      password: data.password,
      isPersistent: true,
    })
    if (error !== null) {
      if (error.status === 401) {
        setFormField(form.password, {
          value: '',
          errors: ['ist nicht korrekt'],
        })
        return
      }
      throw error
    }
    SessionStore.setCurrentUser({
      id: res.id,
      name: res.username,
    })
  }

  return (
    <div>
      <CenteredGrid>
        <UiGrid.Col size={{ md: 8, lg: 6, xl: 4 }}>
          <h1>
            Anmelden
          </h1>
          <form>
            <UiForm.Field field={form.username}>{(props) => (
              <UiTextInput {...props} label="Name" />
            )}</UiForm.Field>
            <UiForm.Field field={form.password}>{(props) => (
              <UiTextInput {...props} label="Passwort" type="password" />
            )}</UiForm.Field>
            <UiForm.Buttons form={form} onSubmit={handleSubmit} />
          </form>
        </UiGrid.Col>
      </CenteredGrid>
    </div>
  )
}
export default SessionForm

interface LoginData {
  username: string
  password: string
}

const CenteredGrid = styled(UiGrid)`
  height: 100vh;
  justify-content: center;
  align-items: center;
  margin-top: -4rem;
`