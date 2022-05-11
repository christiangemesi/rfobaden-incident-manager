import UiSideList from '@/components/Ui/SideList/UiSideList'
import useWhere from '@/utils/hooks/useWhere'
import React, { useCallback, useMemo } from 'react'
import { parseIncidentQuery } from '@/pages/ereignisse/[...path]'
import { useRouter } from 'next/router'
import Incident from '@/models/Incident'
import TransportStore, { useTransports } from '@/stores/TransportStore'
import TransportList from '@/components/Transport/List/TransportList'
import TransportView from '@/components/Transport/View/TransportView'
import Transport from '@/models/Transport'

interface Props {
  incident: Incident
}

const TransportSideView: React.VFC<Props> = ({ incident }) => {
  const router = useRouter()
  const transports = useWhere(useTransports(), (it) => it.incidentId, incident.id)

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

  return (
    <UiSideList
      store={TransportStore}
      initialId={initialId}
      onSelect={rerouteToTransport}
      onDeselect={rerouteToTransports}
      renderList={({ selected, select }) => (
        <TransportList incident={incident} transports={transports} selected={selected} onSelect={select} />
      )}
      renderView={({ selected, close }) => (
        <TransportView incident={incident} transport={selected} onClose={close} />
      )}
    />
  )
}
export default TransportSideView
