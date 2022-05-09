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
  data: {
    incidents: Incident[]
  }
}

const ArchivPage: React.VFC<Props> = ({ data }) => {
  useEffectOnce(() => {
    IncidentStore.saveAll(data.incidents.map(parseIncident))
  })

  const closedIncidents = useIncidents((incidents) => incidents.filter(isClosedIncident))

  return (
    <UiContainer>

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

export const getServerSideProps: GetServerSideProps<Props> = async ({ req }) => {
  const { user, backendService } = getSessionFromRequest(req)
  if (user === null) {
    return { redirect: { statusCode: 302, destination: '/anmelden' }}
  }

  const [incidents, incidentsError]: BackendResponse<Incident[]> = await backendService.list('incidents')
  if (incidentsError !== null) {
    throw incidentsError
  }

  return {
    props: {
      data: {
        incidents,
      },
    },
  }
}
