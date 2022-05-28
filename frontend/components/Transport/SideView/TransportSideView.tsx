import UiSideList from '@/components/Ui/SideList/UiSideList'
import React, { useCallback, useMemo } from 'react'
import { parseIncidentQuery } from '@/pages/ereignisse/[...path]'
import { useRouter } from 'next/router'
import Incident from '@/models/Incident'
import TransportStore, { useTransportsOfIncident } from '@/stores/TransportStore'
import TransportList from '@/components/Transport/List/TransportList'
import TransportView from '@/components/Transport/View/TransportView'
import Transport, { parseTransport } from '@/models/Transport'
import BackendService, { BackendResponse } from '@/services/BackendService'

interface Props {
  incident: Incident
}

const TransportSideView: React.VFC<Props> = ({ incident }) => {
  const router = useRouter()
  const transports = useTransportsOfIncident(incident.id)

  const rerouteToTransport = useCallback((selected: Transport) => {
    const query = parseIncidentQuery(router.query)
    if (query === null) {
      return
    }
    if (query.mode !== 'report' || query.reportId !== selected.id) {
      router.push(`/ereignisse/${selected.incidentId}/transporte/${selected.id}`, undefined, { shallow: true }).then()
    }
  }, [router])

  const rerouteToTransports = useCallback(() => {
    const query = parseIncidentQuery(router.query)
    if (query === null) {
      return
    }
    if (query.mode !== 'transports') {
      router.push(`/ereignisse/${incident.id}/transporte`, undefined, { shallow: true }).then()
    }
  }, [router, incident.id])

  const initialId = useMemo(() => {
    const query = parseIncidentQuery(router.query)
    return query === null || query.mode !== 'transport'
      ? null
      : query.transportId
  }, [router.query])

  const handleToggle = useCallback(async (transport: Transport) => {
    const newTransport = { ...transport, isClosed: !transport.isClosed }
    const [data, error]: BackendResponse<Transport> = await BackendService.update(
      `incidents/${transport.incidentId}/transports`,
      transport.id,
      newTransport,
    )
    if (error !== null) {
      throw error
    }
    TransportStore.save(parseTransport(data))
  }, [])

  return (
    <UiSideList
      store={TransportStore}
      isClosed={(transport) => transport.isClosed}
      initialId={initialId}
      onSelect={rerouteToTransport}
      onDeselect={rerouteToTransports}
      renderList={({ selected, select }) => (
        <TransportList
          incident={incident}
          transports={transports}
          selected={selected}
          onSelect={select}
          onToggle={handleToggle}
        />
      )}
      renderView={({ selected, close }) => (
        <TransportView incident={incident} transport={selected} onClose={close} onToggle={handleToggle} />
      )}
    />
  )
}
export default TransportSideView
