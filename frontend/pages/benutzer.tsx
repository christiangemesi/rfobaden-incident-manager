import UiContainer from '@/components/Ui/Container/UiContainer'
import UserForm from '@/components/User/Form/UserForm'
import React from 'react'
import User from '@/models/User'
import { GetServerSideProps } from 'next'
import BackendService, { BackendResponse } from '@/services/BackendService'
import UserList from '@/components/User/List/UserList'
import Model from '@/models/base/Model'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import { useEffectOnce } from 'react-use'
import UserStore, { useUsers } from '@/stores/UserStore'

interface Props {
  data: {
    users: User[]
  }
}

const BenutzerPage: React.VFC<Props> = ({ data }) => {
  useEffectOnce(() => {
    UserStore.saveAll(data.users)
  })

  const users = useUsers()

  return (
    <UiContainer>
      <h1>
        Benutzer verwalten
      </h1>
      <UiGrid style={{ justifyContent: 'center' }}>
        <UiGrid.Col size={{ md: 8, lg: 6, xl: 4 }}>
          <UserForm />
        </UiGrid.Col>
      </UiGrid>

      <UiGrid style={{ justifyContent: 'center' }}>
        <UiGrid.Col size={{ md: 10, lg: 8, xl: 6 }}>
          <UserList users={users} />
        </UiGrid.Col>
      </UiGrid>
    </UiContainer>
  )
}
export default BenutzerPage

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const [users]: BackendResponse<(Model & { username: string })[]> = await BackendService.list('users')
  return {
    props: {
      data: {
        users: users.map((user) => ({
          id: user.id,
          name: user.username,
        })),
      },
    },
  }
}
