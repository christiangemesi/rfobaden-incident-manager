import Report from '@/models/Report'
import React from 'react'
import UserStore, { useUser } from '@/stores/UserStore'
import { useOrganization } from '@/stores/OrganizationStore'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import styled, { css } from 'styled-components'
import UiListItemWithDetails from '@/components/Ui/List/Item/WithDetails/UiListItemWithDetails'
import User, { useUsername } from '@/models/User'
import { StyledProps } from '@/utils/helpers/StyleHelper'
import UiListItem from '@/components/Ui/List/Item/UiListItem'
import UiTitle from '@/components/Ui/Title/UiTitle'
import Id from '@/models/base/Id'
import BackendService from '@/services/BackendService'
import UiIconButton from '@/components/Ui/Icon/Button/UiIconButton'
import UiModal from '@/components/Ui/Modal/UiModal'
import IncidentForm from '@/components/Incident/Form/IncidentForm'
import UserCreateForm from '@/components/User/Form/UserCreateForm'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UserEditForm from '@/components/User/Form/UserEditForm'

interface Props extends StyledProps {
  user: User

  // firstName: string
  // lastName: string
  // email: string
  // role: string
  // organization: string
}

const UserListItem: React.VFC<Props> = ({
  user,
  // firstName,
  // lastName,
  // email,
  // role,
  // organization,
}) => {
  //const user = useUser(data.user)
  const employedBy = useOrganization(user.organizationId)
  
  const handleDelete = async (userId: Id<User>) => {
    if (confirm(`Sind sie sicher, dass sie den Benutzer "${user.firstName} ${user.lastName}" löschen wollen?`)) {
      await BackendService.delete('users', userId)
      UserStore.remove(userId)
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
            {employedBy.name}
          </UiTitle>
        </UiGrid.Col>
        <UiGrid.Col size={1}>
          <UiModal isFull>
            <UiModal.Activator>{({ open }) => (
              <UiIconButton onClick={open}>
                <UiIcon.EditAction />
              </UiIconButton>
            )}</UiModal.Activator>
            <UiModal.Body>{({ close }) => (
              <React.Fragment>
                <UiTitle level={1} isCentered>
                    Benutzer bearbeiten
                </UiTitle>
                <UserEditForm user={user} onClose={close} />
              </React.Fragment>
            )}</UiModal.Body>
          </UiModal>
          <UiIconButton onClick={() => handleDelete(user.id)}>
            <UiIcon.DeleteAction />
          </UiIconButton>
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
