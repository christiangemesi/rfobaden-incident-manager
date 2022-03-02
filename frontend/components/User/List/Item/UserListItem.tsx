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

interface Props extends StyledProps {
  user: User
  firstName: string
  lastName: string
  email: string
  role: string
  organization: string
}

const UserListItem: React.VFC<Props> = ({
  user,
  firstName,
  lastName,
  email,
  role,
  organization,
}) => {
  const handleDelete = async (userId: Id<User>) => {
    if (confirm(`Sind sie sicher, dass sie den Benutzer "${user.firstName} ${user.lastName}" löschen wollen?`)) {
      await BackendService.delete('users', userId)
      UserStore.remove(userId)
    }
  }
  const employedBy = useOrganization(user.organizationId)

  return (
    <UiListItem>

      <div>
        <UiTitle level={5}>
          {user.firstName} {user.lastName}
        </UiTitle>
        {user.email}
      </div>
      <AlignmentSpacer>
        <LeftSpacer>
          <UiTitle level={6}>
            {user.role}
          </UiTitle>
        </LeftSpacer>
        <LeftSpacer>
          <UiTitle level={6}>
            {employedBy.name}
          </UiTitle>
        </LeftSpacer>
        <LeftSpacer>
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
                <UserCreateForm user={user} onClose={close} />
              </React.Fragment>
            )}</UiModal.Body>
          </UiModal>
          <UiIconButton onClick={() => handleDelete(user.id)}>
            <UiIcon.DeleteAction />
          </UiIconButton>
        </LeftSpacer>
      </AlignmentSpacer>
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

// const SelectableListItem = styled(UiListItem)<{ isActive: boolean }>`
//   ${({ isActive, theme }) => isActive && css`
//     background: ${theme.colors.secondary.contrast};
//     color: ${theme.colors.secondary.value};
//   `}
/*
`
*/
