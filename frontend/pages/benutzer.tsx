import UiContainer from '@/components/Ui/Container/UiContainer'
import React from 'react'
import User, { parseUser } from '@/models/User'
import { GetServerSideProps } from 'next'
import { BackendResponse, getSessionFromRequest } from '@/services/BackendService'
import UserList from '@/components/User/List/UserList'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import { useEffectOnce } from 'react-use'
import UserStore, { useUsers } from '@/stores/UserStore'
import Organization, { parseOrganization } from '@/models/Organization'
import OrganizationStore from '@/stores/OrganizationStore'
import UiTitle from '@/components/Ui/Title/UiTitle'

interface Props {
  data: {
    users: User[]
    organizations: Organization[]
  }
}

const BenutzerPage: React.VFC<Props> = ({ data }) => {
  useEffectOnce(() => {
    UserStore.saveAll(data.users.map(parseUser))
    OrganizationStore.saveAll(data.organizations.map(parseOrganization))
  })

  const users = useUsers()

  return (
    <UiContainer>
      <section>
        <UiGrid>
          <UiGrid.Col>
            <UiTitle level={1}>
              Benutzer verwalten
            </UiTitle>
          </UiGrid.Col>
        </UiGrid>
        <UiGrid.Col size={{ md: 10, lg: 8, xl: 6 }}>
          <UserList users={users} />
        </UiGrid.Col>
      </section>
    </UiContainer>
  )
}
export default BenutzerPage

export const getServerSideProps: GetServerSideProps<Props> = async ({ req }) => {
  const { user, backendService } = getSessionFromRequest(req)
  if (user === null) {
    return { redirect: { statusCode: 302, destination: '/anmelden' }}
  }

  const [users] = await backendService.list<User>('users')

  const [organizations, organizationError]: BackendResponse<Organization[]> = await backendService.list(
    'organizations',
  )
  if (organizationError !== null) {
    throw organizationError
  }

  return {
    props: {
      data: {
        users,
        organizations,
      },
    },
  }
}
