import React from 'react'
import Report, { parseReport } from '@/models/Report'
import styled from 'styled-components'
import BackendService, { BackendResponse } from '@/services/BackendService'
import ReportStore from '@/stores/ReportStore'

interface Props {
  reports: Report[]
}

const ReportList: React.VFC<Props> = ({ reports }) => {
  return (
    <StyledTable>
      <thead>
        <StyledTr>
          <StyledTh>
          Report
          </StyledTh>
          <StyledTh>
          </StyledTh>
          <StyledTh>
          </StyledTh>
        </StyledTr>
      </thead>
      <tbody>
        {reports.map((report) => (
          <ReportListItem key={report.id} report={report}/>
        ))}
      </tbody>
    </StyledTable>
  )
  
}
export default ReportList

interface ReportListItemProps {
  report: Report
}


const ReportListItem: React.VFC<ReportListItemProps> = ({ report }) => {
  const handleDelete = async () => {
    if (confirm(`Sind sie sicher, dass sie die Meldung "${report.title}" schliessen wollen?`)) {
      await BackendService.delete('reports', report.id)
      ReportStore.remove(report.id)
    }
  }

  const handleClose = async () => {
    const closeReason = prompt(`Wieso schliessen sie das "${report.title}"?`, 'Fertig')
    if (closeReason != null && closeReason.length !== 0) {
      const [data, error]: BackendResponse<Report> = await BackendService.update(`reports/${report.id}/close`, {
        closeReason: closeReason,
      })
      if (error !== null) {
        throw error
      }
      ReportStore.save(parseReport(data))
    }
  }

  return (
    <StyledTr>
      <StyledTd>
        {report.title}
      </StyledTd>
      <StyledTd>
        {report.createdAt.toLocaleString()}
      </StyledTd>
      <StyledTd>
        {report.updatedAt.toLocaleString()}
      </StyledTd>
      <StyledTd>
        {report.isClosed ? 'Closed' : 'Open'}
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
        <StyledTd>
          Priority
        </StyledTd>
      </StyledTdSmall>

      <StyledTdSmall>
        <StyledTd>
          Assignee
        </StyledTd>
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


