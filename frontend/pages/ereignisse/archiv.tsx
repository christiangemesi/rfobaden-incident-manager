import UiContainer from '@/components/Ui/Container/UiContainer'
import React, { useEffect } from 'react'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import Incident, { isClosedIncident, parseIncident } from '@/models/Incident'
import IncidentStore, { useIncidents } from '@/stores/IncidentStore'
import { GetServerSideProps } from 'next'
import { BackendResponse, getSessionFromRequest } from '@/services/BackendService'
import IncidentArchiveList from '@/components/Incident/Archive/List/IncidentArchiveList'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiButton from '@/components/Ui/Button/UiButton'
import styled from 'styled-components'

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
          <UiGrid.Col size={{ md: 10, lg: 8, xl: 6 }}>
            <IncidentArchiveList closedIncidents={closedIncidents} />
          </UiGrid.Col>

          <PaginationSummary>
            <ResultCounter>
              {`Ereignis: ${firstShownClosedIncidents} - ${lastShownClosedIncidents} von ${totalClosedIncidents}`}

            </ResultCounter>
            <Pagination>
              {currentOffset === 0 ? (
                <PaginationButton isCurrent={false} isDisabled={true}>
                  <UiIcon.Previous />
                </PaginationButton>
              ) : (
                <PaginationButton isCurrent={false} href={`/ereignisse/archiv?p=${currentOffset-1}`}>
                  <UiIcon.Previous />
                </PaginationButton>
              )}

              {totalPages < 6 &&
          [...Array(totalPages)].map((_element, i) => (
            <PaginationButton key={i} isCurrent={currentOffset === i} href={`/ereignisse/archiv?p=${i}`}>
              {i + 1}
            </PaginationButton>
          ))}

              {(totalPages > 5 && currentOffset < 3) && (
                <React.Fragment>
                  {[...Array(4)].map((_element, i) => (
                    <PaginationButton key={i} isCurrent={currentOffset === i} href={`/ereignisse/archiv?p=${i}`}>
                      {i + 1}
                    </PaginationButton>
                  ))}
                  <MorePlaceholder>
                    <UiIcon.More size={0.8} />
                  </MorePlaceholder>
                  <PaginationButton isCurrent={currentOffset === totalPages-1} href={`/ereignisse/archiv?p=${totalPages-1}`}>
                    {totalPages}
                  </PaginationButton>
                </React.Fragment>
              )}

              {(totalPages > 5 && currentOffset > 2 && currentOffset < totalPages-3) && (
                <React.Fragment>
                  <PaginationButton isCurrent={currentOffset === 0} href={`/ereignisse/archiv?p=${0}`}>
                    {1}
                  </PaginationButton>
                  <MorePlaceholder>
                    <UiIcon.More size={0.8} />
                  </MorePlaceholder>
                  {[...Array(3)].map((_element, i) => {
                    const iOffset = currentOffset-1 + i
                    return (
                      <PaginationButton key={iOffset} isCurrent={currentOffset === iOffset} href={`/ereignisse/archiv?p=${iOffset}`}>
                        {iOffset + 1}
                      </PaginationButton>
                    )
                  })}
                  <MorePlaceholder>
                    <UiIcon.More size={0.8} />
                  </MorePlaceholder>
                  <PaginationButton isCurrent={currentOffset === totalPages-1} href={`/ereignisse/archiv?p=${totalPages-1}`}>
                    {totalPages}
                  </PaginationButton>
                </React.Fragment>
              )}

              {(totalPages > 5 && currentOffset > totalPages-4) && (
                <React.Fragment>
                  <PaginationButton isCurrent={currentOffset === 0} href={`/ereignisse/archiv?p=${0}`}>
                    {1}
                  </PaginationButton>
                  <MorePlaceholder>
                    <UiIcon.More size={0.8} />
                  </MorePlaceholder>
                  {[...Array(4)].map((_element, i) => {
                    const iOffset = totalPages-4 + i
                    return (
                      <PaginationButton key={iOffset} isCurrent={currentOffset === iOffset} href={`/ereignisse/archiv?p=${iOffset}`}>
                        {iOffset + 1}
                      </PaginationButton>
                    )
                  })}
                </React.Fragment>
              )}

              {currentOffset === totalPages - 1 ? (
                <PaginationButton isCurrent={false} isDisabled={true}>
                  <UiIcon.Next />
                </PaginationButton>
              ) : (
                <PaginationButton isCurrent={false} href={`/ereignisse/archiv?p=${currentOffset+1}`}>
                  <UiIcon.Next />
                </PaginationButton>
              )}
            </Pagination>
          </PaginationSummary>
        </React.Fragment>
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
  console.log(offset)

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

const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 1rem;
`
const PaginationButton = styled(UiButton)<{ isCurrent: boolean}>`
  margin: 0 0.1rem;
  min-width: 2rem;

  text-decoration: none;
  background: ${({ theme, isCurrent }) => isCurrent ? theme.colors.primary.value : theme.colors.secondary.value};
  color: ${({ theme, isCurrent }) => isCurrent ? theme.colors.primary.contrast : theme.colors.secondary.contrast};
`
const MorePlaceholder = styled.div`
  padding-top: 0.8rem;
`

