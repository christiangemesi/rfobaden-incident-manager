import React from 'react'
import User from '@/models/User'
import styled from 'styled-components'
import BackendService from '@/services/BackendService'
import UserStore from '@/stores/UserStore'
import Id from '@/models/base/Id'
import UiList from '@/components/Ui/List/UiList'
import UiModal from '@/components/Ui/Modal/UiModal'
import UiCreatButton from '@/components/Ui/Button/UiCreateButton'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiTitle from '@/components/Ui/Title/UiTitle'
import ReportForm from '@/components/Report/Form/ReportForm'
import ReportListItem from '@/components/Report/List/Item/ReportListItem'
import UserCreateForm from '@/components/User/Form/UserCreateForm'
import UserListItem from '@/components/User/List/Item/UserListItem'
import Report from '@/models/Report'

interface Props {
  users: User[]
  //user: User
  activeUser: User
  onClick?: (user: User) => void
}

const UserList: React.VFC<Props> = ({ users , activeUser, onClick: handleClick }) => {
  const handleDelete = async (userId: Id<User>) => {
    await BackendService.delete('users', userId)
    UserStore.remove(userId)
  }

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
      {users.map((user) => (
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
