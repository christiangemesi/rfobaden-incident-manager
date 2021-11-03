import React, { ReactNode, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import Incident, { parseIncident } from '@/models/Incident'
import BackendService, { BackendResponse } from '@/services/BackendService'
import IncidentStore from '@/stores/IncidentStore'
import IncidentView from '@/components/Incident/View/IncidentView'
import * as ReactDOM from 'react-dom'

interface Props {
  incidents: Incident[]
}

const IncidentList: React.VFC<Props> = ({ incidents }) => {
  return (
    <StyledTable>
      <thead>
        <StyledTr>
          <StyledTh>
          Ereignis
          </StyledTh>
          <StyledTh>
          </StyledTh>
          <StyledTh>
          </StyledTh>
        </StyledTr>
      </thead>
      <tbody>
        {incidents.map((incident) => (
          <IncidentListItem key={incident.id} incident={incident} />
        ))}
      </tbody>
    </StyledTable>
  )
}
export default IncidentList

interface IncidentListItemProps {
  incident: Incident
}

const IncidentListItem: React.VFC<IncidentListItemProps> = ({ incident }) => {
  const handleDelete = async () => {
    if (confirm(`Sind sie sicher, dass sie das Ereignis "${incident.title}"`)) {
      await BackendService.delete('incidents', incident.id)
      IncidentStore.remove(incident.id)
    }
  }


  const handleClose = async () => {
    const closeReason = prompt(`Wieso schliessen sie das "${incident.title}"?`, 'Fertig')
    if (closeReason != null && closeReason != '') {
      const [data, error]: BackendResponse<Incident> = await BackendService.update(`incidents/${incident.id}/close`, {
        closeReason: closeReason,
      })
      if (error !== null) {
        throw error
      }
      IncidentStore.save(parseIncident(data))
    }
  }

  const [printer, setPrinter] = useState<ReactNode>()
  const handlePrint = () => {
    const Printer: React.VFC = () => {
      const ref = useRef<HTMLDivElement | null>(null)
      useEffect(() => {
        window.print()
        setPrinter(undefined)
      }, [ref])
      return <IncidentView innerRef={ref} incident={incident} />
    }
    setPrinter(ReactDOM.createPortal((
      <div id="print-only" style={{ margin: '4rem' }}>
        <Printer />
      </div>
    ), document.body))
  }

  return (
    <StyledTr>
      <StyledTd>
        {incident.title}
      </StyledTd>
      <StyledTd>
        {incident.createdAt.toLocaleString()}
      </StyledTd>
      <StyledTd>
        {incident.updatedAt.toLocaleString()}
      </StyledTd>
      <StyledTd>
        {incident.isClosed ? 'Closed' : 'Open'}
      </StyledTd>
      <StyledTdSmall>
        <StyledButton type="button">
          Bearbeiten
        </StyledButton>
      </StyledTdSmall>
      <StyledTdSmall>
        <StyledButton type="button" onClick={handleClose}>
          Schliessen
        </StyledButton>
      </StyledTdSmall>
      <StyledTdSmall>
        <StyledButton type="button" onClick={handleDelete}>
          Löschen
        </StyledButton>
      </StyledTdSmall>
      <StyledTdSmall>
        <StyledButton type="button" onClick={handlePrint}>
          Drucken
          {printer}
        </StyledButton>
      </StyledTdSmall>
    </StyledTr>
  )
}

const StyledTable = styled.table`
  display: block;
  width: 100%;
  border: 1px solid lightgray;
  border-radius: 0.25rem;
  margin-top: 2rem;
`
const StyledTr = styled.tr`
  width: 100%;

  :nth-child(2n) {
    background-color: lightgray;
  }
`
const StyledTh = styled.th`
  padding: 0.5rem;
  vertical-align: middle;
  font-weight: bold;
  text-align: left;
`
const StyledTd = styled.td`
  width: 100%;
  padding: 0.5rem;
  vertical-align: middle;
`
const StyledTdSmall = styled(StyledTd)`
  width: 40px;
`
const StyledButton = styled.button`
  display: block;
  width: 100%;
`
