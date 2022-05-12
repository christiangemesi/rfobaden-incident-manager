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
import Page from '@/components/Page/Page'

interface Props {
  data: {
    incidents: Incident[]
  }
}

const EreignissePage: React.VFC<Props> = ({ data }) => {
  useEffectOnce(() => {
    IncidentStore.saveAll(data.incidents.map(parseIncident))
  })

  const openIncidents = useIncidents((incidents) => incidents.filter((incident) => !isClosedIncident(incident)))
  const closedIncidents = useIncidents((incidents) => incidents
    .filter(isClosedIncident)
    .sort((a, b) => b.closeReason.createdAt.getTime() - a.closeReason.createdAt.getTime())
    .slice(0, 5)
  )

  return (
    <Page>
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
            <UiGrid.Col size={{ md: 10, lg: 8, xl: 6 }}>
              <IncidentArchiveList incidents={closedIncidents} />
            </UiGrid.Col>
          </section>
        )}
      </UiContainer>
    </Page>
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

  return {
    props: {
      data: {
        incidents,
      },
    },
  }
}
