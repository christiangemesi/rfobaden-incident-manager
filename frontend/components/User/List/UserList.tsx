import React from 'react'
import User from '@/models/User'
import styled from 'styled-components'

interface Props {
  users: User[]
}

const UserList: React.VFC<Props> = ({ users }) => {
  return (
    <StyledTable>
      <StyledTr>
        <StyledTh>
          Benutzer
        </StyledTh>
        <StyledTh>

        </StyledTh>
        <StyledTh>

        </StyledTh>
      </StyledTr>
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
            <StyledButton type="button">
              Löschen
            </StyledButton>
          </StyledTdSmall>
        </StyledTr>
      ))}
    </StyledTable>
  )
}
export default UserList

const StyledTable = styled.table`
  display: block;
  width: 100%;
`
const StyledTr = styled.tr`
  width: 100%;
  :nth-child(2n) {
    background-color: lightgray;
  }
`
const StyledTh = styled.th`
  padding: 5px;
  font-weight: bold;
  text-align: left;
`
const StyledTd = styled.td`
  width: 100%;
  padding: 5px;
`
const StyledTdSmall = styled.td`
  width: 40px;
  padding: 5px;
  [src=""] {
    color: red;
  }
`
const StyledButton = styled.button`
  display: block;
  width: 100%;
`