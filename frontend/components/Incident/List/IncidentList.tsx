import React from 'react'
import styled from 'styled-components'
import Id from '@/models/base/Id'
import Incident, { parseIncident } from '@/models/Incident'
import BackendService, { BackendResponse } from '@/services/BackendService'
import IncidentStore from '@/stores/IncidentStore'

interface Props {
    incidents: Incident[]
}

const IncidentList: React.VFC<Props> = ({ incidents }) => {
    const handleDelete = async (incidentId: Id<Incident>) => {
        await BackendService.delete('incidents', incidentId)
        IncidentStore.remove(incidentId)
    }

    const handleClose = async (incidentId: Id<Incident>) => {
        const closeReason = prompt('Please enter the close reason', '')
        const [incident, error]: BackendResponse<Incident> = await BackendService.update(`incidents/${incidentId}/close`, {
            closeReason: closeReason,
        })
        if (error !== null) {
            throw error
        }
        IncidentStore.save(parseIncident(incident))
    }

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
                <StyledTr key={incident.id}>
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
                        <StyledButton type="button" onClick={() => handleClose(incident.id)}>
                            Schliessen
                        </StyledButton>
                    </StyledTdSmall>
                    <StyledTdSmall>
                        <StyledButton type="button" onClick={() => handleDelete(incident.id)}>
                            Löschen
                        </StyledButton>
                    </StyledTdSmall>
                </StyledTr>
            ))}
            </tbody>
        </StyledTable>
    )
}
export default IncidentList

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
