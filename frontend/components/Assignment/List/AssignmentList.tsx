import UiTitle from '@/components/Ui/Title/UiTitle'
import React, { Fragment } from 'react'
import styled from 'styled-components'
import Transport from '@/models/Transport'
import Report from '@/models/Report'
import Task from '@/models/Task'
import Subtask from '@/models/Subtask'
import AssignmentListItem from '@/components/Assignment/List/Item/AssignmentListItem'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiIcon from '@/components/Ui/Icon/UiIcon'

interface Props {
  title?: string
  transports: Transport[]
  reports: Report[]
  tasks: Task[]
  subtasks: Subtask[]
}

const AssignmentList: React.VFC<Props> = ({
  title = '',
  transports,
  reports,
  tasks,
  subtasks,
}) => {

  return (
    <Fragment>
      {title.length > 0 &&
        (<UiTitle level={2}>{title}</UiTitle>)
      }
      <Content>
        <AssignmentListItem title="Transporte" trackable={transports}>{(transport) => (
          <Fragment
            key={transport.id}
            // href={'/ereignisse/' + transport.incidentId + '/transporte/' + transport.id}
          >
          </Fragment>
        )}</AssignmentListItem>
        <AssignmentListItem title="Meldungen" trackable={reports}>{(report) => (
          <Fragment
            key={report.id}
            // href={'/ereignisse/' + report.incidentId + '/meldungen/' + report.id}
          >
            <UiGrid direction="column" gapH={1}>
              {report.isKeyReport && (
                <UiIcon.KeyMessage size={ICON_MULTIPLIER_SMALL} />
              )}
              {report.isLocationRelevantReport && (
                <UiIcon.LocationRelevancy size={ICON_MULTIPLIER_SMALL} />
              )}
            </UiGrid>
            {report.closedTaskIds.length + '/' + report.taskIds.length}
          </Fragment>
        )}</AssignmentListItem>
        <AssignmentListItem title="Aufträge" trackable={tasks}>{(task) => (
          <Fragment
            key={task.id}
            // href={'/ereignisse/' + task.incidentId + '/meldungen/' + task.reportId + '/auftraege/' + task.id}
          >
            {task.closedSubtaskIds.length + '/' + task.subtaskIds.length}
          </Fragment>
        )}</AssignmentListItem>
        <AssignmentListItem title="Teilaufträge" trackable={subtasks}>{(subtask) => (
          <Fragment
            key={subtask.id}
            // href={'/ereignisse/' + subtask.incidentId + '/meldungen/' + subtask.reportId + '/auftraege/' + subtask.taskId}
          >
          </Fragment>
        )}</AssignmentListItem>
      </Content>
    </Fragment>
  )
}

export default AssignmentList

const ICON_MULTIPLIER_SMALL = 0.75

const Content = styled.div`
  margin: 2rem 0;
`
