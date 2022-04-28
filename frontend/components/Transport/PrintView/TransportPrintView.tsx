import React from 'react'
import { useIncident } from '@/stores/IncidentStore'
import styled, { css } from 'styled-components'
import Transport from '@/models/Transport'
import TransportViewHeader from '@/components/Transport/View/Header/TransportViewHeader'

interface Props {
  transport: Transport
  isNested?: boolean
}

const TransportPrintView: React.VFC<Props> = ({ transport, isNested = false }) => {
  const incident = useIncident(transport.incidentId)
  if (incident === null) {
    throw new Error(`incident not found: ${transport.incidentId}`)
  }

  return (
    <Container isNested>
      {isNested || (
        <div style={{ marginBottom: '1rem' }}>
          {incident.title}
        </div>
      )}

      <TransportViewHeader incident={incident} transport={transport} />
    </Container>
  )
}
export default TransportPrintView

const Container = styled.div<{ isNested: boolean }>`
  ${({ isNested }) => isNested && css`
    padding-left: 1rem;
  `}
`
