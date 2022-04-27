import UiTitle from '@/components/Ui/Title/UiTitle'
import React, { Fragment, useMemo } from 'react'
import styled from 'styled-components'
import Incident from '@/models/Incident'
import Transport from '@/models/Transport'
import Report from '@/models/Report'
import Task from '@/models/Task'
import Subtask from '@/models/Subtask'
import UiLink from '@/components/Ui/Link/UiLink'
import TrackableListItem from '@/components/Trackable/List/Item/TrackableListItem'
import AssignedListItem from '@/components/AssignedList/Item/AssignedListItem'
import ReportListItem from '@/components/Report/List/Item/ReportListItem'
import TaskListItem from '@/components/Task/List/Item/TaskListItem'

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
  const diffIncidentIds: Incident[] = useMemo(() => {
    const incidentIds = data.transports.map((e) => e.incidentId).concat(...data.reports.map((e) => e.incidentId)).concat(...data.tasks.map((e) => e.incidentId)).concat(...data.subtasks.map((e) => e.incidentId))
    return data.incidents.filter((e) => incidentIds.includes(e.id)) ?? []
  }, [data])

  const transports: Transport[][] = useMemo(() => {
    return data.transports.reduce((acc, val) => {
      const i: number = val.incidentId
      if (!acc[i]) {
        acc[i] = []
      }
      acc[i].push(val)
      return acc
    }, {} as Transport[][])
  }, [data])

  const reports: Report[][] = useMemo(() => {
    return data.reports.reduce((acc, val) => {
      const i: number = val.incidentId
      if (!acc[i]) {
        acc[i] = []
      }
      acc[i].push(val)
      return acc
    }, {} as Report[][])
  }, [data])

  const tasks: Task[][] = useMemo(() => {
    return data.tasks.reduce((acc, val) => {
      const i: number = val.incidentId
      if (!acc[i]) {
        acc[i] = []
      }
      acc[i].push(val)
      return acc
    }, {} as Task[][])
  }, [data])

  const subtasks: Subtask[][] = useMemo(() => {
    return data.subtasks.reduce((acc, val) => {
      const i: number = val.incidentId
      if (!acc[i]) {
        acc[i] = []
      }
      acc[i].push(val)
      return acc
    }, {} as Subtask[][]) ?? [[]]
  }, [data])

  return (
    <Fragment>
      {diffIncidentIds.length > 0 &&
        (<UiTitle level={2}>{title}</UiTitle>)
      }
      {diffIncidentIds.map((incident) =>
        (<IncidentContainer key={'i' + incident.id}>
          <UiTitle level={3}>{incident.title}</UiTitle>
          <AssignedListItem title="Transporte" trackable={transports[incident.id] ?? []}>{(transport) => (
            <UiLink
              key={transport.id}
              href={'/ereignisse/' + transport.incidentId + '/transporte/' + transport.id}
            >
              <TrackableListItem record={transport} isSmall={false} isActive={false} isClosed={transport.isClosed} />
            </UiLink>
          )}</AssignedListItem>
          <AssignedListItem title="Meldungen" trackable={reports[incident.id] ?? []}>{(report) => (
            <UiLink
              key={report.id}
              href={'/ereignisse/' + report.incidentId + '/meldungen/' + report.id}
            >
              <ReportListItem record={report} isSmall={false} isActive={false} isClosed={report.isClosed} />
            </UiLink>
          )}</AssignedListItem>
          <AssignedListItem title="Aufträge" trackable={tasks[incident.id] ?? []}>{(task) => (
            <UiLink
              key={task.id}
              href={'/ereignisse/' + task.incidentId + '/meldungen/' + task.reportId + '/auftraege/' + task.id}
            >
              <TaskListItem task={task} />
            </UiLink>
          )}</AssignedListItem>
          <AssignedListItem title="Teilaufträge" trackable={subtasks[incident.id] ?? []}>{(subtask) => (
            <UiLink
              key={subtask.id}
              href={'/ereignisse/' + subtask.incidentId + '/meldungen/' + subtask.reportId + '/auftraege/' + subtask.taskId}
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
