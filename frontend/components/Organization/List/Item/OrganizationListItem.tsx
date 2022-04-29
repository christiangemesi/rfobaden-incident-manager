import React from 'react'
import { useOrganization, useOrganizations } from '@/stores/OrganizationStore'
import User, { isAdmin } from '@/models/User'
import { StyledProps } from '@/utils/helpers/StyleHelper'
import UiListItem from '@/components/Ui/List/Item/UiListItem'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiDropDown from '@/components/Ui/DropDown/UiDropDown'
import UiIconButton from '@/components/Ui/Icon/Button/UiIconButton'
import UiModal from '@/components/Ui/Modal/UiModal'
import UserForm from '@/components/User/Form/UserForm'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import BackendService from '@/services/BackendService'
import UserStore from '@/stores/UserStore'
import Id from '@/models/base/Id'
import { useCurrentUser } from '@/stores/SessionStore'
import Organization from '@/models/Organization'
import OrganizationForm from '@/components/Organization/Form/OrganizationForm'

interface Props extends StyledProps {
  organization: Organization
}

const OrganizationListItem: React.VFC<Props> = ({
  organization,
}) => {
  const currentUser = useCurrentUser()

  const handleDelete = async (organizationId: Id<Organization>) => {
    if (confirm(`Sind sie sicher, dass sie die Organisation "${organization.name}" löschen wollen?`)) {
      await BackendService.delete('organizations', organizationId)
      UserStore.remove(organizationId)
    }
  }

  return (
    <UiListItem>
      <UiGrid align="center" gapH={1.5}>
        <UiGrid.Col size={5}>
          <UiTitle level={5}>
            {organization.name}
          </UiTitle>
        </UiGrid.Col>
        <UiGrid.Col size={2}>
          <UiTitle level={6}>
            {organization.userIds.length}
          </UiTitle>
        </UiGrid.Col>
        <UiGrid.Col size={1}>
          {(isAdmin(currentUser)) && (
            <UiDropDown>
              <UiDropDown.Trigger>{({ toggle }) => (
                <UiIconButton onClick={toggle}>
                  <UiIcon.More />
                </UiIconButton>
              )}</UiDropDown.Trigger>
              <UiDropDown.Menu>
                <UiModal title="Organisation bearbeiten">
                  <UiModal.Trigger>{({ open }) => (
                    <UiDropDown.Item onClick={open}>Bearbeiten</UiDropDown.Item>
                  )}</UiModal.Trigger>
                  <UiModal.Body>{({ close }) => (
                    <OrganizationForm organization={organization} onClose={close} />
                  )}</UiModal.Body>
                </UiModal>
                {isAdmin(currentUser) && (
                  <UiDropDown.Item onClick={() => handleDelete(organization.id)}>Löschen</UiDropDown.Item>
                )}
              </UiDropDown.Menu>
            </UiDropDown>
          )}
        </UiGrid.Col>
      </UiGrid>
    </UiListItem>
  )
}
export default OrganizationListItem