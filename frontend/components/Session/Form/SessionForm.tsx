import React, { Fragment, useEffect } from 'react'
import { parseUser } from '@/models/User'
import UiTextInput from '@/components/Ui/Input/Text/UiTextInput'
import BackendService, { BackendResponse } from '@/services/BackendService'
import SessionStore, { useSession } from '@/stores/SessionStore'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { setFormField, useForm, useSubmit } from '@/components/Ui/Form'
import UiForm from '@/components/Ui/Form/UiForm'
import { SessionResponse } from '@/models/Session'
import { useValidate } from '@/components/Ui/Form/validate'
import UiTitle from '@/components/Ui/Title/UiTitle'

const SessionForm: React.VFC = () => {
  const form = useForm<LoginData>(() => ({
    email: '',
    password: '',
  }))
  useValidate(form, (validate) => ({
    email: [
      validate.notBlank(),
      validate.match(/^\S+@\S+\.\S+$/, { message: 'muss eine gültige E-Mail-Adresse sein' }),
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

  useSubmit(form, async (formData: LoginData) => {
    const [data, error]: BackendResponse<SessionResponse> = await BackendService.create('session', {
      ...formData,
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
    SessionStore.setSession(data.token, parseUser(data.user))
  })

  return (
    <Fragment>
      <StyledTitle level={1} isCentered>
        Willkommen
      </StyledTitle>
      <CenteredGrid>
        <UiGrid.Col size={{ md: 8, lg: 6, xl: 4 }}>
          <UiForm form={form}>
            <UiForm.Field field={form.email}>{(props) => (
              <UiTextInput {...props} placeholder="E-Mail" />
            )}</UiForm.Field>
            <UiForm.Field field={form.password}>{(props) => (
              <UiTextInput {...props} placeholder="Passwort" type="password" />
            )}</UiForm.Field>
            <UiForm.Buttons form={form} /> {/*Anmelden statt check */}
          </UiForm>
        </UiGrid.Col>
      </CenteredGrid>
    </Fragment>
  )
}
export default SessionForm

interface LoginData {
  email: string
  password: string
}

const StyledTitle = styled(UiTitle)`
  color: ${({ theme }) => theme.colors.tertiary.value};
  margin-bottom: 2rem;
`
const CenteredGrid = styled(UiGrid)`
  height: 100%;
  justify-content: center;
  align-items: center;

  form > div {
    padding-top: 1rem;
  }
`