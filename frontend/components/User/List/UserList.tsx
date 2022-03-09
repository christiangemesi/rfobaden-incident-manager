import React, { useCallback, useEffect, useMemo, useState } from 'react'
import User from '@/models/User'
import styled from 'styled-components'
import UiList from '@/components/Ui/List/UiList'
import UiModal from '@/components/Ui/Modal/UiModal'
import UiCreatButton from '@/components/Ui/Button/UiCreateButton'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UserForm from '@/components/User/Form/UserForm'
import UserListItem from '@/components/User/List/Item/UserListItem'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiSortButton from '@/components/Ui/Button/UiSortButton'
import useSort from '@/utils/hooks/useSort'
import OrganizationStore from '@/stores/OrganizationStore'

interface Props {
  users: User[]
  onClick?: (user: User) => void
}

const UserList: React.VFC<Props> = ({ users , onClick: handleClick }) => {

  const [sortedUsers, sort] = useSort(users, () => ({
    firstName: String,
    lastName: String,
    role: String,
    organization: ({ organizationId: a },  { organizationId: b }) => {
      if (a === b){
        return 0
      }
      if(a === null) {
        return -1
      }
      if(b === null) {
        return 1
      }
      const aOrg = OrganizationStore.find(a)
      const bOrg = OrganizationStore.find(b)

      if ( aOrg === null || bOrg === null) {
        throw new Error('organization not found')
      }
      return aOrg.name.localeCompare(bOrg.name)
    },
  }))

  return (
    <UiList>
      <UiModal isFull>
        <UiModal.Activator>{({ open }) => (
          <UiCreatButton onClick={open}>
            <UiIcon.CreateAction size={1.4} />
          </UiCreatButton>
        )}</UiModal.Activator>
        <UiModal.Body>{({ close }) => (
          <React.Fragment>
            <UiTitle level={1} isCentered>
              Benutzer erfassen
            </UiTitle>
            <UserForm />
          </React.Fragment>
        )}</UiModal.Body>
      </UiModal>
      <UiGrid style={{ padding: '0 1rem' }} gapH={1.5}>
        <UiGrid.Col size={1}>
          <UiSortButton field={sort.firstName}>
            <UiTitle level={6}>Vorname</UiTitle>
          </UiSortButton>
        </UiGrid.Col>
        <UiGrid.Col size={6}>
          <UiSortButton field={sort.lastName}>
            <UiTitle level={6}>Nachname</UiTitle>
          </UiSortButton>
        </UiGrid.Col>
        <UiGrid.Col size={2}>
          <UiSortButton field={sort.role}>
            <UiTitle level={6}>Rolle</UiTitle>
          </UiSortButton>
        </UiGrid.Col>
        <UiGrid.Col>
          <UiSortButton field={sort.organization}>
            <UiTitle level={6}>Organisation</UiTitle>
          </UiSortButton>
        </UiGrid.Col>
      </UiGrid>
      {sortedUsers.map((user) => (
        <UserListItem
          key={user.id}
          user={user}
        />
      ))}
    </UiList>
    //
    // <StyledTable>
    //   <thead>
    //     <StyledTr>
    //       <StyledTh>
    //         Benutzer
    //       </StyledTh>
    //       <StyledTh>
    //         E-Mail
    //       </StyledTh>
    //       <StyledTh>
    //
    //       </StyledTh>
    //       <StyledTh>
    //
    //       </StyledTh>
    //     </StyledTr>
    //   </thead>
    //   <tbody>
    //     {users.map((user) => (
    //       <StyledTr key={user.id}>
    //         <StyledTd style={{ width: 0 }}>
    //           {user.firstName} {user.lastName}
    //         </StyledTd>
    //         <StyledTd>
    //           {user.email}
    //         </StyledTd>
    //         <StyledTd>
    //
    //         </StyledTd>
    //
    //         <StyledTdSmall>
    //           <StyledButton type="button" onClick={() => handleDelete(user.id)}>
    //             Löschen
    //           </StyledButton>
    //         </StyledTdSmall>
    //       </StyledTr>
    //     ))}
    //   </tbody>
    // </StyledTable>
  )
}
export default UserList

enum SortAttribute{
  FIRST_NAME = 'FIRST_NAME',
  LAST_NAME = 'LAST_NAME',
  ROLE = 'ROLE',
  ORGANIZATION = 'ORGANIZATION',
}

const StyledTable = styled.table`
  display: block;
  width: 100%;
  border: 1px solid lightgray;
  border-radius: 0.25rem;
  margin-top: 2rem;
`
const StyledTr = styled.tr`
  width: 100%;
  :nth-child(2n) {
    background-color: lightgray;
  }
`
const StyledTh = styled.th`
  padding: 0.5rem;
  vertical-align: middle;
  font-weight: bold;
  text-align: left;
`
const StyledTd = styled.td`
  padding: 0.5rem;
  vertical-align: middle;
  width: 100%;
  white-space: nowrap;
`
const StyledTdSmall = styled(StyledTd)`
  width: 0;
`
const StyledButton = styled.button`
  display: block;
  width: 100%;
`
const SortButton = styled.button`
  border: none;
  background: none;
  
  :hover{
    background: white;
    
  }
`
