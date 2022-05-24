import React, { useEffect } from 'react'
import { parseUser } from '@/models/User'
import UiTextInput from '@/components/Ui/Input/Text/UiTextInput'
import BackendService from '@/services/BackendService'
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
  useValidate(form, () => ({
    email: [],
    password: [],
  }))

  const router = useRouter()
  const { currentUser } = useSession()
  useEffect(() => {
    if (currentUser !== null) {
      router.push('/')
    }
  }, [router, currentUser])

  useSubmit(form, async (formData: LoginData) => {
    const [data, error] = await BackendService.create<LoginData, SessionResponse>('session', formData)
    if (error !== null) {
      if (error.status === 401) {
        setFormField(form.email, {
          errors: [''],
        })
        setFormField(form.password, {
          value: '',
          errors: ['ist nicht korrekt'],
        })
        return
      }
      throw error
    }
    if (data.user == null) {
      throw new Error('session was successfully created, but we did not receive user')
    }
    SessionStore.setCurrentUser(parseUser(data.user))
  })

  return (
    <PaddingContainer>
      <StyledTitle level={1} isCentered>
        Willkommen
      </StyledTitle>
      <UiGrid align="center" justify="center">
        <UiGrid.Col size={{ md: 8, lg: 5, xl: 3, xxl: 2 }}>
          <UiForm form={form}>
            <FieldContainer>
              <UiForm.Field field={form.email}>{(props) => (
                <UiTextInput {...props} placeholder="E-Mail" />
              )}</UiForm.Field>
              <UiForm.Field field={form.password}>{(props) => (
                <UiTextInput {...props} placeholder="Passwort" type="password" />
              )}</UiForm.Field>
              <UiForm.Buttons form={form} />
            </FieldContainer>
          </UiForm>
        </UiGrid.Col>
      </UiGrid>
    </PaddingContainer>
  )
}
export default SessionForm

interface LoginData {
  email: string
  password: string
}

const StyledTitle = styled(UiTitle)`
  color: ${({ theme }) => theme.colors.tertiary.value};
  margin-bottom: 3rem;
  min-height: 1em;
`

const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const PaddingContainer = styled.div`
  padding: 0 2rem;
`