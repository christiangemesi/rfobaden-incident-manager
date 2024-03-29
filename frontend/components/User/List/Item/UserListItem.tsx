import React from 'react'
import { useOrganization } from '@/stores/OrganizationStore'
import User, { isAdmin } from '@/models/User'
import { StyledProps } from '@/utils/helpers/StyleHelper'
import UiListItem from '@/components/Ui/List/Item/UiListItem'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiDropDown from '@/components/Ui/DropDown/UiDropDown'
import UiIconButton from '@/components/Ui/Icon/Button/UiIconButton'
import UiDrawer from '@/components/Ui/Drawer/UiDrawer'
import UserForm from '@/components/User/Form/UserForm'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import BackendService, { BackendResponse } from '@/services/BackendService'
import UserStore from '@/stores/UserStore'
import Id from '@/models/base/Id'
import { useCurrentUser } from '@/stores/SessionStore'

interface Props extends StyledProps {

  /**
   * The {@link User} to be displayed.
   */
  user: User
}

/**
 * `UserListItem` is a component that displays one of multiple {@link User users} in a list.
 */
const UserListItem: React.VFC<Props> = ({
  user,
}) => {
  const currentUser = useCurrentUser()

  const organization = useOrganization(user.organizationId)

  const handleDelete = async (userId: Id<User>) => {
    if (confirm(`Sind sie sicher, dass sie den Benutzer "${user.firstName} ${user.lastName}" löschen wollen?`)) {
      await BackendService.delete('users', userId)
      UserStore.remove(userId)
    }
  }

  const resendPassword = async (_userId: Id<User>) => {
    if (confirm(`Sind sie sicher, dass ein neues Passwort für den Benutzer"${user.firstName} ${user.lastName}" generiert werden soll?`)) {
      const [data, error]: BackendResponse<User> = await BackendService.create(`users/${user.id}/reset`, null)
      if (error !== null) {
        throw error
      }
      UserStore.save(data)
    }
  }

  return (
    <UiListItem>
      <UiGrid align="center" gapH={1.5}>
        <UiGrid.Col size={5}>
          <UiTitle level={5}>
            {user.firstName} {user.lastName}
          </UiTitle>
          {user.email}
        </UiGrid.Col>
        <UiGrid.Col size={2}>
          {user.role}
        </UiGrid.Col>
        <UiGrid.Col size={4}>
          {organization?.name ?? '-'}
        </UiGrid.Col>
        <UiGrid.Col size={1}>
          {(isAdmin(currentUser) || currentUser.id === user.id) && (
            <UiDropDown>
              <UiDropDown.Trigger>{({ toggle }) => (
                <UiIconButton onClick={toggle}>
                  <UiIcon.More />
                </UiIconButton>
              )}</UiDropDown.Trigger>
              <UiDropDown.Menu>
                {isAdmin(currentUser) && (
                  <UiDropDown.Item onClick={() => resendPassword(user.id)}>Neues Passwort senden</UiDropDown.Item>
                )}
                <UiDrawer title="Benutzer bearbeiten" size="fixed">
                  <UiDrawer.Trigger>{({ open }) => (
                    <UiDropDown.Item onClick={open}>Bearbeiten</UiDropDown.Item>
                  )}</UiDrawer.Trigger>
                  <UiDrawer.Body>{({ close }) => (
                    <UserForm user={user} onClose={close} />
                  )}</UiDrawer.Body>
                </UiDrawer>
                {isAdmin(currentUser) && (
                  <UiDropDown.Item onClick={() => handleDelete(user.id)}>Löschen</UiDropDown.Item>
                )}
              </UiDropDown.Menu>
            </UiDropDown>
          )}
        </UiGrid.Col>
      </UiGrid>
    </UiListItem>
  )
}
export default UserListItem
