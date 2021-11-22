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
            <StyledTh>
            </StyledTh>
          </StyledTr>
        </thead>
        <tbody>
          <thead>
            {reports.map((report) => (
              <ReportListItem key={report.id} report={report} />
            ))}
          </thead>
        </tbody>
      </StyledTable>
    </div>
  )
}
export default ReportList



interface ReportListItemProps {
  report: Report
}

const ReportListItem: React.VFC<ReportListItemProps> = ({ report }) => {
  return (
    <StyledTr>
      <StyledTd>
        {report.title}
      </StyledTd>
      <StyledTd>
        {report.incident}
      </StyledTd>
      <StyledTd>
        {report.createdAt.toLocaleString()}
      </StyledTd>
      <StyledTd>
        {report.updatedAt.toLocaleString()}
      </StyledTd>
      <StyledTd>
        {report.assigneeId}
      </StyledTd>
      <StyledTdSmall>
        <StyledButton type="button">
          Bearbeiten
        </StyledButton>
      </StyledTdSmall>
      <StyledTdSmall>
        <StyledButton type="button">
          Schliessen
        </StyledButton>
      </StyledTdSmall>
      <StyledTdSmall>
        <StyledButton type="button">
          Löschen
        </StyledButton>
      </StyledTdSmall>
      <StyledTdSmall>
        <StyledButton type="button">
          Drucken
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