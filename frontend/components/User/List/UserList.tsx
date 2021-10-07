import React from 'react'
import User from '@/models/User'

interface Props {
  users: User[]
}

const UserList: React.VFC<Props> = ({ users }) => {
  // TODO list users
  return (
    <div>
      {JSON.stringify(users)}
    </div>
  )
}
export default UserList
