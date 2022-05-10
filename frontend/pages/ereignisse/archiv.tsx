import UiContainer from '@/components/Ui/Container/UiContainer'
import React from 'react'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import Incident, { isClosedIncident, parseIncident } from '@/models/Incident'
import IncidentStore, { useIncidents } from '@/stores/IncidentStore'
import { GetServerSideProps } from 'next'
import { useEffectOnce } from 'react-use'
import { BackendResponse, getSessionFromRequest } from '@/services/BackendService'
import IncidentArchiveList from '@/components/Incident/Archive/List/IncidentArchiveList'
import UiTitle from '@/components/Ui/Title/UiTitle'

interface Props {
  offset: number
  data: {
    page: Page
  }
}

const ArchivPage: React.VFC<Props> = ({ offset, data }) => {
  useEffectOnce(() => {
    IncidentStore.saveAll(data.page.data.map(parseIncident))
  })

  const closedIncidents = useIncidents((incidents) => incidents
    .filter(isClosedIncident)
    .filter( (it) => data.page.data.find( (incident) => incident.id === it.id) )
    .sort( (a, b) => b.closeReason.createdAt.getTime() - a.closeReason.createdAt.getTime() )
  )

  const totalPages = Math.ceil( data.page.total / PAGE_LIMIT )

  return (
    <UiContainer>
      {[...Array(totalPages)].map((_element, i) => (
        <div key={i}>{i + 1}</div>
      ))}
      <UiGrid style={{ padding: '0 0 1rem 0' }}>
        <UiGrid.Col>
          <UiTitle level={1}>
              Archiv
          </UiTitle>
        </UiGrid.Col>
      </UiGrid>
      {closedIncidents.length !== 0 && (
        <UiGrid.Col size={{ md: 10, lg: 8, xl: 6 }}>
          <IncidentArchiveList closedIncidents={closedIncidents} />
        </UiGrid.Col>
      )}
    </UiContainer>
  )
}
export default ArchivPage


const PAGE_LIMIT = 10


interface Page {
  total: number
  data: Incident[]
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ query, req }) => {
  const { user, backendService } = getSessionFromRequest(req)
  if (user === null) {
    return { redirect: { statusCode: 302, destination: '/anmelden' }}
  }
  const offset = typeof query.p === 'string' ? parseInt(query.p) : 0


  const [page, pageError]: BackendResponse<Page> = await backendService.get(`incidents/archive?limit=${PAGE_LIMIT}&offset=${offset}`)
  if (pageError !== null) {
    throw pageError
  }

  return {
    props: {
      offset,
      data: {
        page,
      },
    },
  }
}
