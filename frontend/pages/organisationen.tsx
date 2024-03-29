import UiContainer from '@/components/Ui/Container/UiContainer'
import React from 'react'
import User, { parseUser } from '@/models/User'
import { GetServerSideProps } from 'next'
import { BackendResponse, getSessionFromRequest } from '@/services/BackendService'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import { useEffectOnce } from 'react-use'
import UserStore from '@/stores/UserStore'
import Organization, { parseOrganization } from '@/models/Organization'
import OrganizationStore, { useOrganizations } from '@/stores/OrganizationStore'
import UiTitle from '@/components/Ui/Title/UiTitle'
import OrganizationList from '@/components/Organization/List/OrganizationList'
import Page from '@/components/Page/Page'

interface Props {
  data: {

    /**
     * List of all {@link User users}.
     */
    users: User[]

    /**
     * List of all {@link Organization organizations}.
     */
    organizations: Organization[]
  }
}

/**
 * `OrganisationenPage` displays all {@link Organization organizations}.
 */
const OrganisationenPage: React.VFC<Props> = ({ data }) => {
  useEffectOnce(() => {
    UserStore.saveAll(data.users.map(parseUser))
    OrganizationStore.saveAll(data.organizations.map(parseOrganization))
  })

  const organizations = useOrganizations()

  return (
    <Page>
      <UiContainer>
        <section>
          <UiGrid style={{ padding: '0 0 1rem 0' }}>
            <UiGrid.Col>
              <UiTitle level={1}>
                Organisationen verwalten
              </UiTitle>
            </UiGrid.Col>
          </UiGrid>
          <UiGrid.Col size={{ md: 10, lg: 8, xl: 6 }}>
            <OrganizationList organizations={organizations} hasCreateButton />
          </UiGrid.Col>
        </section>
      </UiContainer>
    </Page>
  )
}
export default OrganisationenPage

export const getServerSideProps: GetServerSideProps<Props> = async ({ req }) => {
  const { user, backendService } = getSessionFromRequest(req)
  if (user === null) {
    return { redirect: { statusCode: 302, destination: '/anmelden' }}
  }

  const [users, usersError]:  BackendResponse<User[]> = await backendService.list<User>(
    'users',
  )
  if (usersError !== null) {
    throw usersError
  }

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
