
import Report, { parseReport } from '@/models/Report'
import styled from 'styled-components'
import BackendService, { BackendResponse } from '@/services/BackendService'
import ReportStore from '@/stores/ReportStore'
import { ReactNode } from 'react'

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
    if (confirm(`Sind sie sicher, dass sie das Ereignis "${report.title}" schliessen wollen?`)) {
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

  //TODO create as soon as Arian created ViewReport
  //    const [printer, setPrinter] = useState<ReactNode>()
  //    const handlePrint = () => {
  //      const Printer: React.VFC = () => {
  //        const ref = useRef<HTMLDivElement | null>(null)
  //        useEffect(() => {
  //          window.print()
  //          setPrinter(undefined)
  //        }, [ref])
  //        return <IncidentView innerRef={ref} incident={incident} />
  //      }
  //      setPrinter(ReactDOM.createPortal((
  //        <div id="print-only" style={{ margin: '4rem' }}>
  //          <Printer />
  //        </div>
  //      ), document.body))
  //    }

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
        <StyledButton type="button" >
            View Report
        </StyledButton>
      </StyledTdSmall>

      <StyledTdSmall>
        <StyledButton type="button" >
          Priority
        </StyledButton>
      </StyledTdSmall>

      <StyledTdSmall>
        <StyledButton type="button" >
          Assignee
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


