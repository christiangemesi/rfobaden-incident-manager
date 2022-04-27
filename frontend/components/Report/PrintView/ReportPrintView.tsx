import React from 'react'
import { useIncident } from '@/stores/IncidentStore'
import styled, { css } from 'styled-components'
import Report from '@/models/Report'
import { useTasksOfReport } from '@/stores/TaskStore'
import ReportViewHeader from '@/components/Report/View/Header/ReportViewHeader'
import TaskPrintView from '@/components/Task/PrintView/TaskPrintView'

interface Props {
  report: Report
  isNested?: boolean
}

const ReportPrintView: React.VFC<Props> = ({ report, isNested = false }) => {
  const tasks = useTasksOfReport(report.id)

  const incident = useIncident(report.incidentId)
  if (incident === null) {
    throw new Error(`incident not found: ${report.incidentId}`)
  }

  return (
    <div>
      <Header isNested>
        {isNested || (
          <div style={{ marginBottom: '1rem' }}>
            {incident.title} / {report.title}
          </div>
        )}

        <ReportViewHeader incident={incident} report={report} />
      </Header>

      <ContentList>
        {tasks.map((task) => (
          <ContentItem key={task.id}>
            <TaskPrintView task={task} isNested />
          </ContentItem>
        ))}
      </ContentList>
    </div>
  )
}
export default ReportPrintView

const Header = styled.div<{ isNested: boolean }>`
  ${({ isNested }) => isNested && css`
    padding-left: 1rem;
  `}
`

const ContentList = styled.ul`
`

const ContentItem = styled.li`
  margin-top: 2rem;
  border-top: 1px solid grey;
  border-left: 1px solid grey;
  padding-top: 1rem;
  padding-left: 1rem;
`