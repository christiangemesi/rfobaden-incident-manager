import UiContainer from '@/components/Ui/Container/UiContainer'
import React, { useEffect } from 'react'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import Incident, { isClosedIncident, parseIncident } from '@/models/Incident'
import IncidentStore, { useIncidents } from '@/stores/IncidentStore'
import { GetServerSideProps } from 'next'
import { BackendResponse, getSessionFromRequest } from '@/services/BackendService'
import IncidentArchiveList from '@/components/Incident/Archive/List/IncidentArchiveList'
import UiTitle from '@/components/Ui/Title/UiTitle'
import styled from 'styled-components'
import UiPagination from '@/components/Ui/Pagination/UiPagination'
import Page from '@/components/Page/Page'

interface Props {
  offset: number
  data: {
    page: Page
  }
}

const ArchivPage: React.VFC<Props> = ({ offset, data }) => {
  useEffect(() => {
    IncidentStore.saveAll(data.page.data.map(parseIncident))
  }, [data])

  const closedIncidents = useIncidents((incidents) => incidents
    .filter(isClosedIncident)
    .filter( (it) => data.page.data.find( (incident) => incident.id === it.id) )
    .sort( (a, b) => b.closeReason.createdAt.getTime() - a.closeReason.createdAt.getTime() )
  , [data.page])

  const currentOffset = offset

  const totalPages = Math.ceil( data.page.total / PAGE_LIMIT )
  const totalClosedIncidents = data.page.total
  const firstShownClosedIncidents = currentOffset*10 + 1
  const lastShownClosedIncidents = currentOffset*10 + closedIncidents.length

  return (
    <Page>
      <UiContainer>
        <UiGrid style={{ padding: '0 0 1rem 0' }}>
          <UiGrid.Col>
            <UiTitle level={1}>
              Archiv
            </UiTitle>
          </UiGrid.Col>
        </UiGrid>
        {closedIncidents.length === 0 ? (
          <UiTitle level={5}>
            {'Keine Einträge vorhanden'}
          </UiTitle>
        ) : (
          <React.Fragment>
            <UiPagination currentOffset={currentOffset} totalPages={totalPages} makeHref={(p) => `/ereignisse/archiv?p=${p}`} />
            <UiGrid.Col size={{ md: 10, lg: 8, xl: 6 }}>
              <IncidentArchiveList closedIncidents={closedIncidents} />
            </UiGrid.Col>

            <PaginationSummary>
              <ResultCounter>
                {`Ereignis: ${firstShownClosedIncidents} - ${lastShownClosedIncidents} von ${totalClosedIncidents}`}
              </ResultCounter>
              <UiPagination currentOffset={currentOffset} totalPages={totalPages} makeHref={(p) => `/ereignisse/archiv?p=${p}`} />
            </PaginationSummary>
          </React.Fragment>
        )}
      </UiContainer>
    </Page>
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


const PaginationSummary = styled.div`
  display: flex;
  justify-content: space-between;
`

const ResultCounter = styled.p`
  justify-content: flex-start;
  padding: 0.2rem 1rem;
  font-size: 12px;
`
