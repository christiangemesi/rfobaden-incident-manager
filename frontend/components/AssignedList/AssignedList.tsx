import UiTitle from '@/components/Ui/Title/UiTitle'
import React, { Fragment } from 'react'
import styled from 'styled-components'
import Transport from '@/models/Transport'
import Report from '@/models/Report'
import Task from '@/models/Task'
import Subtask from '@/models/Subtask'
import UiLink from '@/components/Ui/Link/UiLink'
import AssignedListItem from '@/components/AssignedList/Item/AssignedListItem'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiIcon from '@/components/Ui/Icon/UiIcon'

interface Props {
  title?: string
  transports: Transport[]
  reports: Report[]
  tasks: Task[]
  subtasks: Subtask[]
}

const AssignedList: React.VFC<Props> = ({
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
        <AssignedListItem title="Transporte" trackable={transports}>{(transport) => (
          <UiLink
            key={transport.id}
            href={'/ereignisse/' + transport.incidentId + '/transporte/' + transport.id}
          >
          </UiLink>
        )}</AssignedListItem>
        <AssignedListItem title="Meldungen" trackable={reports}>{(report) => (
          <UiLink
            key={report.id}
            href={'/ereignisse/' + report.incidentId + '/meldungen/' + report.id}
          >
            <UiGrid direction={'column'} gapH={1}>
              {report.isKeyReport ? (
                <UiIcon.KeyMessage size={ICON_MULTIPLIER_SMALL} />
              ) : <React.Fragment />}
              {report.isLocationRelevantReport ? (
                <UiIcon.LocationRelevancy size={ICON_MULTIPLIER_SMALL} />
              ) : <React.Fragment />}
            </UiGrid>
            {report.closedTaskIds.length + '/' + report.taskIds.length}
          </UiLink>
        )}</AssignedListItem>
        <AssignedListItem title="Aufträge" trackable={tasks}>{(task) => (
          <UiLink
            key={task.id}
            href={'/ereignisse/' + task.incidentId + '/meldungen/' + task.reportId + '/auftraege/' + task.id}
          >
            {task.closedSubtaskIds.length + '/' + task.subtaskIds.length}
          </UiLink>
        )}</AssignedListItem>
        <AssignedListItem title="Teilaufträge" trackable={subtasks}>{(subtask) => (
          <UiLink
            key={subtask.id}
            href={'/ereignisse/' + subtask.incidentId + '/meldungen/' + subtask.reportId + '/auftraege/' + subtask.taskId}
          >
          </UiLink>
        )}</AssignedListItem>
      </Content>
    </Fragment>
  )
}

export default AssignedList

const ICON_MULTIPLIER_SMALL = 0.75

const Content = styled.div`
  margin: 2rem 0;
`
