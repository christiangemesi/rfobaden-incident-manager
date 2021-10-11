import UiContainer from '@/components/Ui/Container/UiContainer'
import UserForm from '@/components/User/Form/UserForm'
import React from 'react'
import User from '@/models/User'
import { GetServerSideProps } from 'next'
import BackendService from '@/services/BackendService'
import UserList from '@/components/User/List/UserList'
import Model from '@/models/base/Model'

interface Props {
  users: User[]
}

const BenutzerPage: React.VFC<Props> = ({ users }) => {
  return (
    <UiContainer>
      <UserForm />
      <UserList users={users} />
    </UiContainer>
  )
}
export default BenutzerPage

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const users: User[] = (await BackendService.list('users')).map((user: Model & { username: string }) => ({
    id: user.id,
    name: user.username,
  }))
  return {
    props: {
      users,
    },
  }
}
