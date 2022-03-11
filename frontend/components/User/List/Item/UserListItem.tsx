import React from 'react'
import UserStore from '@/stores/UserStore'
import { useOrganization } from '@/stores/OrganizationStore'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import User from '@/models/User'
import { StyledProps } from '@/utils/helpers/StyleHelper'
import UiListItem from '@/components/Ui/List/Item/UiListItem'
import UiTitle from '@/components/Ui/Title/UiTitle'
import Id from '@/models/base/Id'
import BackendService from '@/services/BackendService'
import UiIconButton from '@/components/Ui/Icon/Button/UiIconButton'
import UiModal from '@/components/Ui/Modal/UiModal'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UserForm from '@/components/User/Form/UserForm'

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

  // TODO: is not working yet
  const resendPassword = async (userId: Id<User>) => {
    if (confirm(`Sind sie sicher, dass ein neues Passwort für den Benutzer"${user.firstName} ${user.lastName}" generiert werden soll?`)) {
      alert('not possible yet')
    }
  }

  return (
    <UiListItem>
      <UiGrid style={{ alignItems: 'center', flexWrap: 'nowrap' }} gapH={1.5}>
        <UiGrid.Col size={6}>
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
        <UiGrid.Col size={3}>
          <UiTitle level={6}>
            {employedBy?.name}
          </UiTitle>
        </UiGrid.Col>
        <UiGrid.Col size={1}>
          {/*<UiDropDown>*/}
          {/*  <UiDropDown.Trigger>*/}
          {/*    <UiIconButton>*/}
          {/*      <UiIcon.More />*/}
          {/*    </UiIconButton>*/}
          {/*  </UiDropDown.Trigger>*/}

          {/*  <UiDropDown.Item onClick={() => resendPassword(user.id)}>Neues Passwort senden</UiDropDown.Item>*/}
          {/*  <UiModal isFull>*/}
          {/*    <UiModal.Activator>{({ open }) => (*/}
          {/*      <UiDropDown.Item onClick={open}>Bearbeiten</UiDropDown.Item>*/}
          {/*    )}</UiModal.Activator>*/}
          {/*    <UiModal.Body>{({ close }) => (*/}
          {/*      <React.Fragment>*/}
          {/*        <UiTitle level={1} isCentered>*/}
          {/*          Benutzer bearbeiten*/}
          {/*        </UiTitle>*/}
          {/*        <UserForm user={user} onClose={close} />*/}
          {/*      </React.Fragment>*/}
          {/*    )}</UiModal.Body>*/}
          {/*  </UiModal>*/}
          {/*  <UiDropDown.Item onClick={() => handleDelete(user.id)}>Löschen</UiDropDown.Item>*/}
          {/*</UiDropDown>*/}
        </UiGrid.Col>
      </UiGrid>
    </UiListItem>
  )
}
export default UserListItem