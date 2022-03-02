import Report from '@/models/Report'
import React from 'react'
import { useUser } from '@/stores/UserStore'
import { useOrganization } from '@/stores/OrganizationStore'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import styled, { css } from 'styled-components'
import UiListItemWithDetails from '@/components/Ui/List/Item/WithDetails/UiListItemWithDetails'
import User, { useUsername } from '@/models/User'
import { StyledProps } from '@/utils/helpers/StyleHelper'
import UiListItem from '@/components/Ui/List/Item/UiListItem'
import UiTitle from '@/components/Ui/Title/UiTitle'

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
  // const employedBy = useOrganization(user.organizationId)

  return (
    <UiListItem>
      <div>
        <UiTitle level={5}>
          {user.firstName} {user.lastName}
        </UiTitle>
        {user.email}
      </div>
      <UiTitle level={6}>
        {user.role}
      </UiTitle>
      <UiTitle level={6}>
        {/*{employedBy}*/}
      </UiTitle>

      
    
    </UiListItem>
  )
}
export default UserListItem

const LeftSpacer = styled.div`
  margin-left: 1rem;
`

// const SelectableListItem = styled(UiListItem)<{ isActive: boolean }>`
//   ${({ isActive, theme }) => isActive && css`
//     background: ${theme.colors.secondary.contrast};
//     color: ${theme.colors.secondary.value};
//   `}
/*
`
*/
