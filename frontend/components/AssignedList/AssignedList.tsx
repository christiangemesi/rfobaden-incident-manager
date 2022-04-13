import UiTitle from '@/components/Ui/Title/UiTitle'
import React, { Fragment } from 'react'
import styled from 'styled-components'
import Incident from '@/models/Incident'
import AssignedListItem from '@/components/AssignedList/Item/AssignedListItem'
import Transport from '@/models/Transport'
import Report from '@/models/Report'
import Task from '@/models/Task'
import Subtask from '@/models/Subtask'

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
  // const incidentIds = transports

  return (
    <Fragment>

      <UiTitle level={2}>{title}</UiTitle>
      {data.incidents.map((incident) =>
        (<IncidentContainer key={'i' + incident.id}>
          <UiTitle level={3}>{incident.title}</UiTitle>
          <AssignedListItem title="Transporte" trackable={data.transports.filter((e) => e.incidentId == incident.id)} />
          <AssignedListItem title="Meldungen" trackable={data.reports.filter((e) => e.incidentId == incident.id)} />
          <AssignedListItem title="Aufträge" trackable={data.tasks.filter((e) => e.incidentId == incident.id)} />
          <AssignedListItem title="Teilaufträge" trackable={data.subtasks.filter((e) => e.incidentId == incident.id)} />
        </IncidentContainer>))}
    </Fragment>
  )
}

export default AssignedList

const IncidentContainer = styled.div`
  margin: 2rem 0;
`
