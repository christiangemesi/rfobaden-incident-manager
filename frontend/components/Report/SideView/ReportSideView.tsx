import Report from '@/models/Report'
import UiSideList from '@/components/Ui/SideList/UiSideList'
import ReportStore, { useReportsOfIncident } from '@/stores/ReportStore'
import ReportList from '@/components/Report/List/ReportList'
import ReportView from '@/components/Report/View/ReportView'
import React, { useCallback, useMemo } from 'react'
import { parseIncidentQuery } from '@/pages/ereignisse/[...path]'
import { useRouter } from 'next/router'
import Incident from '@/models/Incident'

interface Props {
  incident: Incident
}

const ReportSideView: React.VFC<Props> = ({ incident }) => {
  const router = useRouter()
  const reports = useReportsOfIncident(incident.id)

  const rerouteToReport = useCallback((selected: Report) => {
    const query = parseIncidentQuery(router.query)
    if (query === null) {
      return
    }
    if (query.mode !== 'report' || query.reportId !== selected.id) {
      router.push(`/ereignisse/${selected.incidentId}/meldungen/${selected.id}`, undefined, { shallow: true }).then()
    }
  }, [router])

  const rerouteToRoot = useCallback(() => {
    const query = parseIncidentQuery(router.query)
    if (query === null) {
      return
    }
    if (query.mode !== 'incident') {
      router.push(`/ereignisse/${incident.id}`, undefined, { shallow: true }).then()
    }
  }, [router, incident.id])

  const initialId = useMemo(() => {
    const query = parseIncidentQuery(router.query)
    return query === null || !(query.mode === 'report' || query.mode === 'task')
      ? null
      : query.reportId
  }, [router.query])

  return (
    <UiSideList
      store={ReportStore}
      initialId={initialId}
      onSelect={rerouteToReport}
      onDeselect={rerouteToRoot}
      renderList={({ selected, select }) => (
        <ReportList incident={incident} reports={reports} selected={selected} onSelect={select} />
      )}
      renderView={({ selected, close }) => (
        <ReportView incident={incident} report={selected} onClose={close} />
      )}
    />
  )
}
export default ReportSideView
