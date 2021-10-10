import React from 'react'
import User from '@/models/User'

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
        // eslint-disable-next-line react/jsx-key
        <StyledTr>
          <StyledTd>
            {user['username']}
          </StyledTd>
          <StyledTdSmall>
            <a>
               {/*TODO path to icon */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="" alt="Bearbeiten" title="Bearbeiten"/>
            </a>
          </StyledTdSmall>
          <StyledTdSmall>
              <a>
                {/*TODO path to icon */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="" alt="Löschen" title="Löschen"/>
              </a>
          </StyledTdSmall>
        </StyledTr>
      ))}
    </StyledTable>
  )
}
export default UserList
