import React from 'react'
import UserStore, { useUser } from '@/stores/UserStore'
import { useOrganization } from '@/stores/OrganizationStore'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import styled from 'styled-components'
import User, { parseUser } from '@/models/User'
import { StyledProps } from '@/utils/helpers/StyleHelper'
import UiListItem from '@/components/Ui/List/Item/UiListItem'
import UiTitle from '@/components/Ui/Title/UiTitle'
import Id from '@/models/base/Id'
import BackendService, { BackendResponse } from '@/services/BackendService'
import UiIconButton from '@/components/Ui/Icon/Button/UiIconButton'
import UiModal from '@/components/Ui/Modal/UiModal'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UserForm from '@/components/User/Form/UserForm'
import userStore from '@/stores/UserStore'
import UiDropDown from '@/components/Ui/DropDown/UiDropDown'

interface Props extends StyledProps {
  user: User
}

const UserListItem: React.VFC<Props> = ({
  user,
}) => {
  const employedBy = useOrganization(user.organizationId)
  
  const handleDelete = async (userId: Id<User>) => {
    if (confirm(`Sind sie sicher, dass sie den Benutzer "${user.firstName} ${user.lastName}" löschen wollen?`)) {
      await BackendService.delete('users', userId)
      UserStore.remove(userId)
    }
  }
  const resendPassword = async (userId: Id<User>) => {
    if (confirm(`Sind sie sicher, dass ein neues Passwort für den Benutzer"${user.firstName} ${user.lastName}" generiert werden soll?`)) {
      alert('not possible yet')
    }
  }
  

  return (
    <UiListItem>
      <UiGrid style={{ alignItems: 'center' }} gapH={1.5}>
        <UiGrid.Col size={7}>
          <UiTitle level={5}>
            {user.firstName} {user.lastName}
          </UiTitle>
          {user.email}
        </UiGrid.Col>

        <UiGrid.Col size={2}>
          <UiTitle level={6}>
            {user.role}
          </UiTitle>
        </UiGrid.Col>
        <UiGrid.Col size={2}>
          <UiTitle level={6}>
            {employedBy?.name}
          </UiTitle>
        </UiGrid.Col>
        <UiGrid.Col size={1}>
          <UiDropDown>
            <UiDropDown.Trigger>
              <UiIconButton>
                <UiIcon.More />
              </UiIconButton>
            </UiDropDown.Trigger>

            <UiDropDown.Item onClick={() => resendPassword(user.id)}>neues Passwort senden</UiDropDown.Item>
            <UiModal isFull>
              <UiModal.Activator>{({ open }) => (
                <UiDropDown.Item onClick={open}>Bearbeiten</UiDropDown.Item>
              )}</UiModal.Activator>
              <UiModal.Body>{({ close }) => (
                <React.Fragment>
                  <UiTitle level={1} isCentered>
                    Benutzer bearbeiten
                  </UiTitle>
                  <UserForm user={user} onClose={close} />
                </React.Fragment>
              )}</UiModal.Body>
            </UiModal>
            <UiDropDown.Item onClick={() => handleDelete(user.id)}>Löschen</UiDropDown.Item>
          </UiDropDown>

        </UiGrid.Col>
      </UiGrid>
    </UiListItem>
  )
}
export default UserListItem

const LeftSpacer = styled.div`
  margin-left: 2rem;
`
const AlignmentSpacer = styled.div`
  display: flex;
  `
const RightSide = styled.div`
  display: flex;
  align-items: center;
  
  flex: 0 0 auto;
  width: auto;
  max-width: 100%;
`
