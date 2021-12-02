import React from 'react'
import Report from '@/models/Report'
import styled from 'styled-components'
import BackendService from '@/services/BackendService'
import ReportStore from '@/stores/ReportStore'
import { useUser } from '@/stores/UserStore'
import UiList from '@/components/Ui/List/UiList'
import UiListItemWithDetails from '@/components/Ui/List/Item/WithDetails/UiListItemWithDetails'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import { useTasksOfReport } from '@/stores/TaskStore'

interface Props {
  reports: Report[]
  onClick?: (report: Report) => void
}

const ReportList: React.VFC<Props> = ({ reports, onClick: handleClick }) => {
  return (
    <UiList>
      {reports.map((report) => (
        <ReportListItem key={report.id} report={report} onClick={handleClick} />
      ))}
    </UiList>
  )
}
export default ReportList

interface ReportListItemProps {
  report: Report
  onClick?: (report: Report) => void
}


const ReportListItem: React.VFC<ReportListItemProps> = ({ report, onClick: handleClick }) => {
  const assignee = useUser(report.assigneeId)
  const assigneeName = assignee?.firstName + ' ' + assignee?.lastName ?? ''

  const tasksAll = useTasksOfReport(report.id)
  const tasksDone = tasksAll.filter((task) => task.closedAt !== null)

  const handleDelete = async () => {
    if (confirm(`Sind sie sicher, dass sie die Meldung "${report.title}" schliessen wollen?`)) {
      await BackendService.delete(`incidents/${report.incidentId}/reports`, report.id)
      ReportStore.remove(report.id)
    }
  }

  const keyMessage = true
  const locationRelevancy = true
  console.log(tasksAll)
  console.log(tasksDone)
  return (
    <UiListItemWithDetails title={report.title} priority={report.priority} user={assigneeName}
      onClick={handleClick && (() => handleClick(report))}>
      {keyMessage ?
        <StyledDiv>
          <UiIcon.KeyMessage />
        </StyledDiv>
        : <EmptyIcon />
      }
      {locationRelevancy ?
        <StyledDiv>
          <UiIcon.LocationRelevancy />
        </StyledDiv>
        : <EmptyIcon />
      }
      <StyledDiv>
        {tasksDone.length}/{tasksAll.length}
      </StyledDiv>
    </UiListItemWithDetails>
  )
}


const StyledDiv = styled.div`
  margin-left: 1rem;
`

const EmptyIcon = styled.div`
  margin-left: 1rem;
  width: 23px;
`