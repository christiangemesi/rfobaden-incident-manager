import React from 'react'
import User, { parseUser, UserRole } from '@/models/User'
import UiTextInput from '@/components/Ui/Input/Text/UiTextInput'
import BackendService, { BackendResponse } from '@/services/BackendService'
import UserStore from '@/stores/UserStore'
import { clearForm, useCancel, useForm, useSubmit } from '@/components/Ui/Form'
import UiForm from '@/components/Ui/Form/UiForm'
import { ModelData } from '@/models/base/Model'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiSelectInput from '@/components/Ui/Input/Select/UiSelectInput'
import { useValidate } from '@/components/Ui/Form/validate'
import OrganizationStore, { useOrganizations } from '@/stores/OrganizationStore'
import Id from '@/models/base/Id'
import Organization from '@/models/Organization'
import Incident from '@/models/Incident'
import { GetServerSideProps } from 'next'
import styled from 'styled-components'
import UiToggle from '@/components/Ui/Toggle/UiToggle'

interface Props {
  user?: User | null
  onClose?: () => void
}

const UserEditForm: React.VFC<Props> = ({ user = null, onClose: handleClose }) => {
  const form = useForm<ModelData<User>>(user,() => ({
    email: '',
    firstName: '',
    lastName: '',
    role: UserRole.ADMIN,
    organizationId: null,
  }))

  useValidate(form, (validate) => ({
    email: [
      validate.notBlank(),
      validate.match(/^\S+@\S+\.\S+$/, { message: 'muss eine gültige E-Mail-Adresse sein' }),
    ],
    firstName: [
      validate.notBlank(),
    ],
    lastName: [
      validate.notBlank(),
    ],
    role: [],
    organizationId: [],
  }))

  useSubmit(form, async (formData: ModelData<User>) => {
    const [data]: BackendResponse<User> = user === null
      ? await BackendService.create('users', formData)
      : await BackendService.update('users', user.id, formData)
    UserStore.save(parseUser(data))
    clearForm(form)
    if (handleClose) {
      handleClose()
    }
  })
  useCancel(form, handleClose)

  const organizationIds = useOrganizations((organizations) => organizations.map(({ id }) => id))
  return (

    <UiForm form={form}>
      <FormContainer>
        <UiGrid gap={1}>
          <UiGrid align="center">
            <UiGrid.Col textAlign="right">
              <InputWrapper> {/*//TODO adapt for UIToggle!*/}
                <Input type="checkbox"  />
                <Slider />
                {'neues Passwort senden'} {/*//ToDo generate new PW!*/}
              </InputWrapper>
            </UiGrid.Col>
          </UiGrid>

          <UiGrid.Col size={{ xs: 12, md: 6 }}>
            <UiForm.Field field={form.firstName}>{(props) => (
              <UiTextInput {...props} label="Vorname" />
            )}</UiForm.Field>
          </UiGrid.Col>
          <UiGrid.Col>
            <UiForm.Field field={form.lastName}>{(props) => (
              <UiTextInput {...props} label="Nachname" />
            )}</UiForm.Field>
          </UiGrid.Col>
        </UiGrid>
        <UiForm.Field field={form.email}>{(props) => (
          <UiTextInput {...props} label="E-Mail" />
        )}</UiForm.Field>
        <UiForm.Field field={form.role}>{(props) => (
          <UiSelectInput {...props} label="Rolle" options={Object.values(UserRole)} />
        )}</UiForm.Field>
        <UiForm.Field field={form.organizationId}>{(props) => (
          <UiSelectInput {...props} label="Organisation" options={organizationIds} optionName={mapOrganizationIdToName} />
        )}</UiForm.Field>
        <UiForm.Buttons form={form} />
      </FormContainer>
    </UiForm>

  )
}
export default UserEditForm

const mapOrganizationIdToName = (id: Id<Organization>): string | null => {
  const organization = OrganizationStore.find(id)
  return organization === null
    ? null
    : `${organization.name}`
}

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`
const InputWrapper = styled.label`
  position: relative;
  display: inline-flex;
  align-items: center;
  :hover {
    cursor: pointer;
  }
`
const Input = styled.input`
  position: absolute;
  left: -9999px;
  top: -9999px;
  
  &:checked + span {
    background-color: ${({ theme }) => theme.colors.primary.value};
    
    &:before {
      left: calc(100% - 2px);
      transform: translate(-100%);
    }
  }
`
const Slider = styled.span`
  display: inline-flex;
  cursor: pointer;
  width: 40px;
  height: 20px;
  border-radius: 80px;
  background-color: #bfbfbf;
  position: relative;
  transition: background-color 0.2s;
  margin-right: 0.5rem;

  &:before {
    content: "";
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    border-radius: 16px;
    transition: 0.2s;
    background: #fff;
  }
  
  &:active:before {
    width: 28px;
  }
`