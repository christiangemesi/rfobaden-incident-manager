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
import IncidentList from '@/components/Incident/List/IncidentList'

interface Props {
  data: {
    incidents: Incident[]
  }
}

const EreignissePage: React.VFC<Props> = ({ data }) => {
  useEffectOnce(() => {
    IncidentStore.saveAll(data.incidents.map(parseIncident))
  })

  const closedIncidents = useIncidents((incidents) => incidents.filter(isClosedIncident))
  const openIncidents = useIncidents((incidents) => incidents.filter((incident) => !isClosedIncident(incident)))

  return (
    <UiContainer>
      <section>
        <UiGrid>
          <UiGrid.Col>
            <UiTitle level={1}>
              Ereignisse
            </UiTitle>
          </UiGrid.Col>
        </UiGrid>

        <IncidentList incidents={openIncidents} />
      </section>

      {closedIncidents.length !== 0 && (
        <section>
          <div style={{ margin: '4rem 0 1rem 0' }}>
            <UiTitle level={2}>Geschlossene Ereignisse</UiTitle>
          </div>

          <UiGrid style={{ padding: '0 1rem' }} gapH={1.5}>
            <UiGrid.Col size={4}>
              <UiTitle level={6} style={{ marginLeft: '-1rem' }}>Title</UiTitle>
            </UiGrid.Col>
            <UiGrid.Col size={2}>
              <UiTitle level={6}>Startdatum</UiTitle>
            </UiGrid.Col>
            <UiGrid.Col size={2}>
              <UiTitle level={6}>Schliessdatum</UiTitle>
            </UiGrid.Col>
            <UiGrid.Col>
              <UiTitle level={6}>Begründung</UiTitle>
            </UiGrid.Col>
          </UiGrid>
          <IncidentArchiveList incidents={closedIncidents} />
        </section>
      )}
    </UiContainer>
  )
}
export default EreignissePage

export const getServerSideProps: GetServerSideProps<Props> = async ({ req }) => {
  const { user, backendService } = getSessionFromRequest(req)
  if (user === null) {
    return { redirect: { statusCode: 302, destination: '/anmelden' }}
  }

  const [incidents, incidentsError]: BackendResponse<Incident[]> = await backendService.list('incidents')
  if (incidentsError !== null) {
    throw incidentsError
  }

  console.log(incidents)

  return {
    props: {
      data: {
        incidents,
      },
    },
  }
}
