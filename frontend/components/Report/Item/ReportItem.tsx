import Report from '@/models/Report'
import React from 'react'
import styled from 'styled-components'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UiDateLabel from '@/components/Ui/DateLabel/UiDateLabel'
import UiTextWithIcon from '@/components/Ui/TextWithIcon/UiTextWithIcon'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import TaskList from '@/components/Task/List/TaskList'
import { useTasksOfReport } from '@/stores/TaskStore'

interface Props {
  report: Report
}

const ReportItem: React.VFC<Props> = ({ report }) => {

  const tasks = useTasksOfReport(report.id)

  // TODO get organisations from assignees
  const organisationList = ['Berufsfeuerwehr Baden', 'Werkhof Baden', 'Werkhof Turgi']//reports.map((report) => report.assigneeId)
  const organisations = organisationList.reduce((a, b) => a + ', ' + b)

  const startDate = report.startsAt !== null ? report.startsAt : report.createdAt

  return (
    <UiGrid gap={1}>
      <UiGrid.Col size={12}>
        <UiTitle level={2}>
          {report.title}
        </UiTitle>
      </UiGrid.Col>
      <UiGrid.Col size={12}>
        <StyledP>
          <UiDateLabel start={startDate} end={report.endsAt} type={'datetime'} />
        </StyledP>
      </UiGrid.Col>
      <UiGrid.Col size={12}>
        {report.description}
      </UiGrid.Col>
      <UiGrid.Col size={'auto'}>{/*TODO width auto or 6*/}
        <UiTextWithIcon text={report.location ?? ''}>
          <UiIcon.LocationRelevancy /> {/* TODO location icon */}
        </UiTextWithIcon>
      </UiGrid.Col>
      <UiGrid.Col size={'auto'}>
        <UiTextWithIcon text={organisations}>
          <UiIcon.Organization />
        </UiTextWithIcon>
      </UiGrid.Col>
      <UiGrid.Col size={12}>
        {report.addendum}
      </UiGrid.Col>
      <TaskList tasks={tasks} />
    </UiGrid>
  )
}
export default ReportItem

const StyledP = styled.p`
  margin-bottom: 2rem;

  :last-child {
    margin-bottom: 0;
  }
`