import React, { EventHandler, MouseEvent } from 'react'
import { isAdmin } from '@/models/User'
import { StyledProps } from '@/utils/helpers/StyleHelper'
import UiListItem from '@/components/Ui/List/Item/UiListItem'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiDropDown from '@/components/Ui/DropDown/UiDropDown'
import UiIconButton from '@/components/Ui/Icon/Button/UiIconButton'
import UiDrawer from '@/components/Ui/Drawer/UiDrawer'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import BackendService from '@/services/BackendService'
import { useUsers } from '@/stores/UserStore'
import Id from '@/models/base/Id'
import { useCurrentUser } from '@/stores/SessionStore'
import Organization from '@/models/Organization'
import OrganizationForm from '@/components/Organization/Form/OrganizationForm'
import UserList from '@/components/User/List/UserList'
import OrganizationStore from '@/stores/OrganizationStore'

interface Props extends StyledProps {

  /**
   * The {@link Organization} to be displayed.
   */
  organization: Organization

  /**
   * Event caused by clicking on a {@link Organization}.
   */
  onClick?: EventHandler<MouseEvent>
}

/**
 * `OrganizationListItem` is a component that displays one of multiple {@link Organization organizations} in a list.
 */
const OrganizationListItem: React.VFC<Props> = ({
  organization,
}) => {
  const currentUser = useCurrentUser()

  const orgUsers = useUsers(organization.userIds)

  const handleDelete = async (organizationId: Id<Organization>) => {
    if (confirm(`Sind sie sicher, dass sie die Organisation "${organization.name}" löschen wollen?`)) {
      await BackendService.delete('organizations', organizationId)
      OrganizationStore.remove(organizationId)
    }
  }

  return (
    <UiDrawer position="right" size="full">
      <UiDrawer.Trigger>{({ open }) => (
        <UiListItem onClick={open}>
          <UiGrid align="center" gapH={1.5}>
            <UiGrid.Col size={7}>
              <UiTitle level={5}>
                {organization.name}
              </UiTitle>
            </UiGrid.Col>
            <UiGrid.Col textAlign="right" size={4}>
              <UiTitle level={6}>
                {organization.userIds.length}
              </UiTitle>
            </UiGrid.Col>
            <UiGrid.Col size={1} onClick={(e) => e.stopPropagation()}>
              {(isAdmin(currentUser)) && (
                <UiDropDown>
                  <UiDropDown.Trigger>{({ toggle }) => (
                    <UiIconButton onClick={toggle}>
                      <UiIcon.More />
                    </UiIconButton>
                  )}</UiDropDown.Trigger>
                  <UiDropDown.Menu>
                    <UiDrawer title="Organisation bearbeiten" size="fixed">
                      <UiDrawer.Trigger>{({ open }) => (
                        <UiDropDown.Item onClick={open}>Bearbeiten</UiDropDown.Item>
                      )}</UiDrawer.Trigger>
                      <UiDrawer.Body>{({ close }) => (
                        <OrganizationForm organization={organization} onClose={close} />
                      )}</UiDrawer.Body>
                    </UiDrawer>
                    {isAdmin(currentUser) && (
                      <UiDropDown.Item onClick={() => handleDelete(organization.id)}>Löschen</UiDropDown.Item>
                    )}
                  </UiDropDown.Menu>
                </UiDropDown>
              )}
            </UiGrid.Col>
          </UiGrid>
        </UiListItem>
      )}</UiDrawer.Trigger>
      <UiDrawer.Body>
        <UiTitle level={2}>
          {organization.name}
        </UiTitle>
        {organization.userIds.length === 0 ? (
          <UiTitle level={5}>
            {`Der Organisation "${organization.name}" sind keine Benutzer zugeteilt.`}
          </UiTitle>
        ) : (
          <UiGrid.Col size={{ md: 10, lg: 8, xl: 6 }}>
            <UserList users={orgUsers} />
          </UiGrid.Col>
        )}
      </UiDrawer.Body>
    </UiDrawer>
  )
}
export default OrganizationListItem