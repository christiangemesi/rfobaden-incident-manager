import Report from '@/models/Report'
import React from 'react'
import styled from 'styled-components'

interface Props {
  reports: Report[]
}

const ReportList: React.VFC<Props> = ({ reports }) => {
  return (
    <div>
      <StyledTable>
        <thead>
          <StyledTr>
            <StyledTh>
            Meldung
            </StyledTh>
            <StyledTh>
            </StyledTh>
          </StyledTr>
        </thead>
        <tbody>
          <thead>
            {reports.map((report) => (
            // <IncidentListItem key={incident.id} incident={incident}/>
              <div key={report.id}>
                {report.title}
                {report.description}
                {report.assigneeId}
              </div>
            ))}
          </thead>
        </tbody>
      </StyledTable>
    </div>
  )
}

export default ReportList

interface IncidentListItemProps {
  report: Report
}

const IncidentListItem: React.VFC<IncidentListItemProps> = ({ report }) => {

  return (
    <StyledTr>
      <StyledTd>
        {report.title}
      </StyledTd>
      <StyledTd>
        {report.description}
      </StyledTd>
      <StyledTd>
        {report.assigneeId}
      </StyledTd>
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