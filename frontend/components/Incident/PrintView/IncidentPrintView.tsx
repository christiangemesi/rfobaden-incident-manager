import React from 'react'
import styled from 'styled-components'
import Incident from '@/models/Incident'
import { useReportsOfIncident } from '@/stores/ReportStore'
import IncidentViewHeader from '../View/Header/IncidentViewHeader'
import ReportPrintView from '@/components/Report/PrintView/ReportPrintView'
import { useTransportsOfIncident } from '@/stores/TransportStore'
import TransportPrintView from '@/components/Transport/PrintView/TransportPrintView'

interface Props {
  incident: Incident
}

const IncidentPrintView: React.VFC<Props> = ({ incident }) => {
  const reports = useReportsOfIncident(incident.id)
  const transports = useTransportsOfIncident(incident.id)

  return (
    <div>
      <IncidentViewHeader incident={incident} />

      <ContentList>
        {reports.map((report) => (
          <ContentItem key={report.id}>
            <ReportPrintView report={report} isNested />
          </ContentItem>
        ))}
        {transports.map((transport) => (
          <ContentItem key={transport.id}>
            <TransportPrintView transport={transport} isNested />
          </ContentItem>
        ))}
      </ContentList>
    </div>
  )
}
export default IncidentPrintView

const ContentList = styled.div`
`

const ContentItem = styled.div`
  margin-top: 2rem;
  border-left: 1px solid grey;
  border-bottom: 1px solid grey;
  padding-top: 1rem;
  padding-bottom: 1rem;
`