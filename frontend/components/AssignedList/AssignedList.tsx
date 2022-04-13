import UiTitle from '@/components/Ui/Title/UiTitle'
import React, { Fragment } from 'react'
import styled from 'styled-components'
import Incident from '@/models/Incident'
import AssignedListItem from '@/components/AssignedList/Item/AssignedListItem'
import Transport from '@/models/Transport'
import Report from '@/models/Report'
import Task from '@/models/Task'
import Subtask from '@/models/Subtask'
import UiLink from '@/components/Ui/Link/UiLink'
import TaskListItem from '@/components/Task/List/Item/TaskListItem'
import ReportListItem from '@/components/Report/List/Item/ReportListItem'
import TrackableListItem from '@/components/Trackable/List/Item/TrackableListItem'

interface Props {
  title: string
  data: {
    incidents: Incident[]
    transports: Transport[]
    reports: Report[]
    tasks: Task[]
    subtasks: Subtask[]
  }
}

const AssignedList: React.VFC<Props> = ({
  title,
  data,
}) => {
  const incidentIds = data.transports.map((e) => e.incidentId).concat(...data.reports.map((e) => e.incidentId)).concat(...data.tasks.map((e) => e.incidentId)).concat(...data.subtasks.map((e) => e.incidentId))
  const diffIncidentIds = data.incidents.filter((e) => incidentIds.includes(e.id))
  // todo memoize filters
  return (
    <Fragment>
      {diffIncidentIds.length > 0 &&
        (<UiTitle level={2}>{title}</UiTitle>)
      }
      {diffIncidentIds.map((incident) =>
        (<IncidentContainer key={'i' + incident.id}>
          <UiTitle level={3}>{incident.title}</UiTitle>
          <AssignedListItem title="Transporte" trackable={data.transports.filter((e) => e.incidentId == incident.id)}>{(transport) => (
            <UiLink
              key={transport.id}
              href={'/ereignisse/' + transport.incidentId + '/transporte/' + transport.id}
            >
              <TrackableListItem record={transport} isSmall={false} isActive={false} isClosed={transport.isClosed} />
            </UiLink>
          )}</AssignedListItem>
          <AssignedListItem title="Meldungen" trackable={data.reports.filter((e) => e.incidentId == incident.id)}>{(report) => (
            <UiLink
              key={report.id}
              href={'/ereignisse/' + report.incidentId + '/meldungen/' + report.id}
            >
              <ReportListItem record={report} isSmall={false} isActive={false} isClosed={report.isClosed} />
            </UiLink>
          )}</AssignedListItem>
          <AssignedListItem title="Aufträge" trackable={data.tasks.filter((e) => e.incidentId == incident.id)}>{(task) => (
            <UiLink
              key={task.id}
              href={'/ereignisse/' + task.incidentId + '/meldungen/' + task.reportId + '/auftraege/' + task.id}
            >
              <TaskListItem task={task} />
            </UiLink>
          )}</AssignedListItem>
          <AssignedListItem title="Teilaufträge" trackable={data.subtasks.filter((e) => e.incidentId == incident.id)}>{(subtask) => (
            <UiLink
              key={subtask.id}
              href={'/ereignisse/' + subtask.incidentId + '/meldungen/' + subtask.reportId + '/auftraege/' + subtask.id + '/teilauftraege/' + subtask.id}
            >
              <TrackableListItem record={subtask} isActive={false} isSmall={false} isClosed={subtask.isClosed} />
            </UiLink>
          )}</AssignedListItem>
        </IncidentContainer>))}
    </Fragment>
  )
}

export default AssignedList

const IncidentContainer = styled.div`
  margin: 2rem 0;
`
