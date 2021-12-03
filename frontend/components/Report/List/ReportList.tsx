import React from 'react'
import Report from '@/models/Report'
import styled, { css } from 'styled-components'
import { useUser } from '@/stores/UserStore'
import UiList from '@/components/Ui/List/UiList'
import UiListItemWithDetails from '@/components/Ui/List/Item/WithDetails/UiListItemWithDetails'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import { useTasksOfReport } from '@/stores/TaskStore'

interface Props {
  reports: Report[]
  activeReport: Report | null
  onClick?: (report: Report) => void
}

const ReportList: React.VFC<Props> = ({ reports, activeReport, onClick: handleClick }) => {
  return (
    <UiList>
      {reports.map((report) => (
        <ReportListItem key={report.id} report={report} onClick={handleClick} isActive={activeReport == report} />
      ))}
    </UiList>
  )
}
export default ReportList

interface ReportListItemProps {
  report: Report
  isActive: boolean
  onClick?: (report: Report) => void
}


const ReportListItem: React.VFC<ReportListItemProps> = ({ report, isActive, onClick: handleClick }) => {

  const assignee = useUser(report.assigneeId)
  const assigneeName = assignee?.firstName + ' ' + assignee?.lastName ?? ''

  // TODO not func
  const tasksAll = useTasksOfReport(report.id)
  const tasksDone = tasksAll.filter((task) => task.closedAt != null)

  const keyMessage = true
  const locationRelevancy = true

  return (
    <StyledReportListItem
      title={report.title}
      priority={report.priority}
      user={assigneeName}
      onClick={handleClick && (() => handleClick(report))}
      isActive={isActive}
    >
      {keyMessage ?
        <StyledDiv>
          <UiIcon.KeyMessage />
        </StyledDiv>
        : <UiIcon.Empty />
      }
      {locationRelevancy ?
        <StyledDiv>
          <UiIcon.LocationRelevancy />
        </StyledDiv>
        : <UiIcon.Empty />
      }
      <StyledDiv>
        {tasksDone.length}/{tasksAll.length}
      </StyledDiv>
    </StyledReportListItem>
  )
}


const StyledDiv = styled.div`
  margin-left: 1rem;
`

const StyledReportListItem = styled(UiListItemWithDetails)<{ isActive: boolean }>`
  ${({ isActive }) => isActive && css`
    background: ${({ theme }) => theme.colors.secondary.value};
    color: ${({ theme }) => theme.colors.secondary.contrast};
  `}
`