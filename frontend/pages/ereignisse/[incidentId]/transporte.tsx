import UiContainer from '@/components/Ui/Container/UiContainer'
import React from 'react'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import { GetServerSideProps } from 'next'
import { useEffectOnce } from 'react-use'
import { BackendResponse, getSessionFromRequest } from '@/services/BackendService'
import UiTitle from '@/components/Ui/Title/UiTitle'
import TransportStore, { useTransports } from '@/stores/TransportStore'
import Transport, { parseTransport } from '@/models/Transport'
import TransportList from '@/components/Transport/List/TransportList'
import Incident from '@/models/Incident'
import { parseIncidentQuery } from '../[...path]'

interface Props {
  data: {
    incident: Incident,
    transports: Transport[]
  }
}

const EreignissePage: React.VFC<Props> = ({ data }) => {
  useEffectOnce(() => {
    TransportStore.saveAll(data.transports.map(parseTransport))
  })

  const transports = useTransports()

  return (
    <UiContainer>
      <section>
        <UiGrid>
          <UiGrid.Col>
            <UiTitle level={1}>
              Transporte
            </UiTitle>
          </UiGrid.Col>
        </UiGrid>

        <TransportList incident={incident} transports={transports} />
      </section>
    </UiContainer>
  )
}
export default EreignissePage

type Query = {
    path: string[]
  }

export const getServerSideProps: GetServerSideProps<Props, Query> = async ({ req, params }) => {
  const { user, backendService } = getSessionFromRequest(req)
  if (user === null) {
    return { redirect: { statusCode: 302, destination: '/anmelden' }}
  }

  const query = parseIncidentQuery(params)
  if (query === null) {
    return { notFound: true }
  }

  const [incident, incidentError]: BackendResponse<Incident> = await backendService.find(
    `incidents/${query.incidentId}`,
  )
  if (incidentError !== null) {
    if (incidentError.status === 404) {
      return { notFound: true }
    }
    throw incidentError
  }

  const [transports, transportsError]: BackendResponse<Transport> = await backendService.find(
    `incidents/${incident.id}/transports/${query.transportId}`,
  )
  if (transportsError !== null) {
    throw transportsError
  }

  return {
    props: {
      data: {
        incident,
        transports,
      },
    },
  }
}