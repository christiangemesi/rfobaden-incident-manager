import React from 'react'
import { useIncident } from '@/stores/IncidentStore'
import styled, { css } from 'styled-components'
import Report from '@/models/Report'
import { useTasksOfReport } from '@/stores/TaskStore'
import ReportViewHeader from '@/components/Report/View/Header/ReportViewHeader'
import TaskPrintView from '@/components/Task/PrintView/TaskPrintView'

interface Props {
  /**
   * The report to display.
   */
  report: Report

  /**
   * Whether this is the top-level item of this print. Setting this to `true` displays some more metadata, such as the title of the incident that the report belongs to.
   */
  isNested?: boolean
}

/**
 * `ReportPrintView` is a component that displays a report for a print out.
 */
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
            {incident.title}
          </div>
        )}

        <ReportViewHeader incident={incident} report={report} hasPriority />
      </Header>

      <ContentList>
        {tasks.map((task) => (
          <ContentItem key={task.id} isNested>
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

const ContentList = styled.div`
`

const ContentItem = styled.div<{ isNested: boolean }>`
  margin-top: 2rem;
  border-top: 1px solid grey;
  padding-top: 1rem;
  padding-left: 1rem;
  
  ${({ isNested }) => !isNested && css`
    border-left: 1px solid grey;
  `}
`
