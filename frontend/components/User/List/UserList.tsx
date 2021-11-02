import React from 'react'
import User from '@/models/User'
import styled from 'styled-components'
import BackendService from '@/services/BackendService'
import UserStore from '@/stores/UserStore'
import Id from '@/models/base/Id'

interface Props {
  users: User[]
}

const UserList: React.VFC<Props> = ({ users }) => {
  const handleDelete = async (userId: Id<User>) => {
    await BackendService.delete('users', userId)
    UserStore.remove(userId)
  }

  return (
    <StyledTable>
      <thead>
        <StyledTr>
          <StyledTh>
            Benutzer
          </StyledTh>
          <StyledTh>

          </StyledTh>
          <StyledTh>

          </StyledTh>
        </StyledTr>
      </thead>
      <tbody>
        {users.map((user) => (
          <StyledTr key={user.id}>
            <StyledTd>
              {user.name}
            </StyledTd>
            <StyledTdSmall>
              <StyledButton type="button">
                Bearbeiten
              </StyledButton>
            </StyledTdSmall>
            <StyledTdSmall>
              <StyledButton type="button" onClick={() => handleDelete(user.id)}>
                Löschen
              </StyledButton>
            </StyledTdSmall>
          </StyledTr>
        ))}
      </tbody>
    </StyledTable>
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
  width: 100%;
  padding: 0.5rem;
  vertical-align: middle;
`
const StyledTdSmall = styled(StyledTd)`
  width: 40px;
`
const StyledButton = styled.button`
  display: block;
  width: 100%;
`
