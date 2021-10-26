import React from 'react'
import styled from 'styled-components'
import Id from '@/models/base/Id'
import Incident from '@/models/Incident'

interface Props {
    incidents: Incident[]
}

const handleDelete = (incidentId: Id<Incident>) => {
    console.log('Deleting incident: ' + incidentId)
}

const handleClose = (incidentId: Id<Incident>) => {
    console.log('Closing incident: ' + incidentId)
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
                <StyledTr key={incident.id}>
                    <StyledTd>
                        {incident.title}
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
