import React from 'react'
import Report, { parseReport } from '@/models/Report'
import styled from 'styled-components'
import BackendService, { BackendResponse } from '@/services/BackendService'
import ReportStore from '@/stores/ReportStore'
import { useUser } from '@/stores/UserStore'

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
            Status
          </StyledTh>
          <StyledTh>
            Priorität
          </StyledTh>
          <StyledTh>
            Ersteller
          </StyledTh>
          <StyledTh>
            Zuweisung
          </StyledTh>
        </StyledTr>
      </thead>
      <tbody>
        {reports.map((report) => (
          <ReportListItem key={report.id} report={report} />
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
  const author = useUser(report.authorId)
  const assignee = useUser(report.assigneeId)

  const handleDelete = async () => {
    if (confirm(`Sind sie sicher, dass sie die Meldung "${report.title}" schliessen wollen?`)) {
      await BackendService.delete(`incidents/${report.incidentId}/reports`, report.id)
      ReportStore.remove(report.id)
    }
  }

  const handleComplete = async () => {
    const reason = prompt(`Wieso schliessen sie das "${report.title}"?`, 'Fertig')
    if (reason != null && reason.length !== 0) {
      const [data, error]: BackendResponse<Report> = await BackendService.update(
        `incidents/${report.incidentId}/reports/${report.id}/complete`,
        { reason: reason },
      )
      if (error !== null) {
        throw error
      }
      console.log(data)
      ReportStore.save(parseReport(data))
    }
  }

  const handleReopen = async () => {
    const [data, error]: BackendResponse<Report> = await BackendService.update(
      `incidents/${report.incidentId}/reports/${report.id}/reopen`, {}
    )
    if (error !== null) {
      throw error
    }
    ReportStore.save(parseReport(data))
  }

  return (
    <StyledTr>
      <StyledTd>
        {report.title}
      </StyledTd>
      <StyledTd>
        {report.isComplete ? 'Abgeschlossen' : 'Aktiv'}
      </StyledTd>
      <StyledTd>
        {report.priority}
      </StyledTd>
      <StyledTd>
        {author === null ? '-' : (
          `${author.firstName} ${author.lastName}`
        )}
      </StyledTd>
      <StyledTd>
        {assignee === null ? '-' : (
          `${assignee.firstName} ${assignee.lastName}`
        )}
      </StyledTd>

      <StyledTdSmall>
        <StyledButton type="button">
          Bearbeiten
        </StyledButton>
      </StyledTdSmall>
      <StyledTdSmall>
        {report.isComplete ? (
          <StyledButton type="button" onClick={handleReopen}>
            Öffnen
          </StyledButton>
        ) : (
          <StyledButton type="button" onClick={handleComplete}>
            Schliessen
          </StyledButton>
        )}
      </StyledTdSmall>
      <StyledTdSmall>
        <StyledButton type="button" onClick={handleDelete}>
          Löschen
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
  width: 10%;
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


