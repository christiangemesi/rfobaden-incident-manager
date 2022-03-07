import React, { useCallback, useEffect, useMemo, useState } from 'react'
import User from '@/models/User'
import styled from 'styled-components'
import UiList from '@/components/Ui/List/UiList'
import UiModal from '@/components/Ui/Modal/UiModal'
import UiCreatButton from '@/components/Ui/Button/UiCreateButton'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UserCreateForm from '@/components/User/Form/UserCreateForm'
import UserListItem from '@/components/User/List/Item/UserListItem'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiSortButton from '@/components/Ui/Button/UiSortButton'

interface Props {
  users: User[]
  //user: User
  //activeUser: User
  onClick?: (user: User) => void
}

const UserList: React.VFC<Props> = ({ users , onClick: handleClick }) => {

  const [sortAttributes, setSortAttributes] = useState<[SortAttribute, 'asc' | 'desc'][]>([])
  const setSort = useCallback((attribute, direction) => {
    const attributes = [...sortAttributes]
    const i = attributes.findIndex(([a]) => a === attribute)
    if (i !== (-1)){
      attributes.splice(i,1)
    }
    attributes.push([attribute, direction])
    setSortAttributes(attributes)
  }, [sortAttributes])

  console.log(sortAttributes)
  const [sortedUsers, setSortedUsers] = useState(() => [...users])

  useEffect( () => {
    setSortedUsers([...users])
  }, [users])

  const [skipSort, setSkipSort] = useState(false)
  useEffect(() => {
    setSkipSort(!skipSort)
    if (skipSort){
      return
    }
    const users = [...sortedUsers]
    for (const [attribute, direction] of sortAttributes){
      switch (attribute){
      case SortAttribute.FIRST_NAME: {
        let compareUsers = (a: User, b: User) => a.firstName.localeCompare(b.firstName)
        if (direction === 'desc') {
          const compareUsersAsc = compareUsers
          compareUsers = (a, b) => compareUsersAsc(a,b)*(-1)
        }
        users.sort(compareUsers)
        break
      }
      case SortAttribute.LAST_NAME:{
        let compareUsers = (a: User, b: User) => a.lastName.localeCompare(b.lastName)
        if (direction === 'desc') {
          const compareUsersAsc = compareUsers
          compareUsers = (a, b) => compareUsersAsc(a,b)*(-1)
        }
        users.sort(compareUsers)
        break
      }
      case SortAttribute.ROLE:{
        let compareUsers = (a: User, b: User) => a.role.localeCompare(b.role)
        if (direction === 'desc') {
          const compareUsersAsc = compareUsers
          compareUsers = (a, b) => compareUsersAsc(a,b)*(-1)
        }
        users.sort(compareUsers)
        break
      }
      case SortAttribute.ORGANIZATION:{

        break
      }
      }
    }
    setSortedUsers(users)
  },[sortAttributes, sortedUsers])

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
            <UserCreateForm />
          </React.Fragment>
        )}</UiModal.Body>
      </UiModal>
      <UiGrid style={{ padding: '0 1rem' }} gapH={1.5}>
        <UiGrid.Col size={1}>
          <UiSortButton onClick={(direction) => setSort(SortAttribute.FIRST_NAME, direction)}>
            <UiTitle level={6}>Vorname</UiTitle>
          </UiSortButton>
        </UiGrid.Col>
        <UiGrid.Col size={6}>
          <UiSortButton onClick={(direction) => setSort(SortAttribute.LAST_NAME, direction)}>
            <UiTitle level={6}>Nachname</UiTitle>
          </UiSortButton>
        </UiGrid.Col>
        <UiGrid.Col size={2}>
          <UiSortButton onClick={(direction) => setSort(SortAttribute.ROLE, direction)}>
            <UiTitle level={6}>Rolle</UiTitle>
          </UiSortButton>
        </UiGrid.Col>
        <UiGrid.Col>
          <UiSortButton onClick={(direction) => setSort(SortAttribute.ORGANIZATION, direction)}>
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
