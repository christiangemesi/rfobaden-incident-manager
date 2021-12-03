import Report, { parseReport } from '@/models/Report'
import React, { ReactNode, useEffect, useRef, useState } from 'react'
import ReportStore, { useReportsOfIncident } from '@/stores/ReportStore'
import UiContainer from '@/components/Ui/Container/UiContainer'
import { GetServerSideProps } from 'next'
import BackendService, { BackendResponse } from '@/services/BackendService'
import Incident from '@/models/Incident'
import { useIncident } from '@/stores/IncidentStore'
import { useEffectOnce } from 'react-use'
import SessionOnly from '@/components/Session/Only/SessionOnly'
import User, { parseUser } from '@/models/User'
import UserStore from '@/stores/UserStore'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UiDateLabel from '@/components/Ui/DateLabel/UiDateLabel'
import styled from 'styled-components'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiTextWithIcon from '@/components/Ui/TextWithIcon/UiTextWithIcon'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import ReportList from '@/components/Report/List/ReportList'
import UiActionButton from '@/components/Ui/Button/UiActionButton'
import ReportItem from '@/components/Report/Item/ReportItem'
import UiIconButton from '@/components/Ui/Icon/Button/UiIconButton'
import UiIconButtonGroup from '@/components/Ui/Icon/Button/Group/UiIconButtonGroup'
import * as ReactDOM from 'react-dom'
import IncidentView from '@/components/Incident/View/IncidentView'
import Task, { parseTask } from '@/models/Task'
import TaskStore from '@/stores/TaskStore'

interface Props {
  data: {
    incident: Incident
    reports: Report[]
    tasks: Task[]
    users: User[]
  }
}

const MeldungenPage: React.VFC<Props> = ({ data }) => {
  useEffectOnce(() => {
    ReportStore.saveAll(data.reports.map(parseReport))
    UserStore.saveAll(data.users.map(parseUser))
    TaskStore.saveAll(data.tasks.map(parseTask))
  })

  const incident = useIncident(data.incident)
  const reports = useReportsOfIncident(incident.id)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)

  // TODO check if working
  const [printer, setPrinter] = useState<ReactNode>()
  const handlePrint = () => {
    const Printer: React.VFC = () => {
      const ref = useRef<HTMLDivElement | null>(null)
      useEffect(() => {
        window.print()
        setPrinter(undefined)
      }, [ref])
      return <IncidentView innerRef={ref} incident={incident} />
    }
    setPrinter(ReactDOM.createPortal((
      <div id="print-only" style={{ margin: '4rem' }}>
        <Printer />
      </div>
    ), document.body))
  }

  const handleDelete = async () => {
    if (confirm(`Sind sie sicher, dass sie die Meldung "${incident.title}" schliessen wollen?`)) {
      await BackendService.delete('incidents/', incident.id)
      ReportStore.remove(incident.id)
    }
  }

  // TODO get organisations from assignees for incident
  const organisationList = ['Berufsfeuerwehr Baden', 'freiwillige Feuerwehr Baden', 'Werkhof Baden', 'Werkhof Turgi']//reports.map((report) => report.assigneeId)
  const organisations = organisationList.reduce((a, b) => a + ', ' + b)

  const startDate = incident.startsAt !== null ? incident.startsAt : incident.createdAt

  return (
    <SessionOnly doRedirect>
      <UiContainer>
        <UiGrid gapH={2} gapV={1}>
          <UiGrid.Col size={12}>
            <UiTitle level={1}>
              {incident.title}
            </UiTitle>
          </UiGrid.Col>
          <UiGrid.Col size={12}>
            <StyledDiv>
              <UiDateLabel start={startDate} end={incident.endsAt} type={'datetime'} />
              <UiIconButtonGroup>
                <UiIconButton onClick={handlePrint}>
                  <UiIcon.PrintAction />
                  {printer}
                </UiIconButton>
                <UiIconButton> {/*TODO*/}
                  <UiIcon.EditAction />
                </UiIconButton>
                <UiIconButton onClick={handleDelete}>
                  <UiIcon.DeleteAction />
                </UiIconButton>
              </UiIconButtonGroup>
            </StyledDiv>
          </UiGrid.Col>
          <UiGrid.Col size={6}>
            {incident.description}
          </UiGrid.Col>
          <UiGrid.Col size={6}>
            <UiTextWithIcon text={organisations}>
              <UiIcon.UserInCircle />
            </UiTextWithIcon>
          </UiGrid.Col>
          <UiGrid.Col size={6}>
            <StyledDiv>
              <div>{/*TODO fill in modal form instead of div*/}</div>
              <UiActionButton>
                <UiIcon.CreateAction />
              </UiActionButton>
            </StyledDiv>
          </UiGrid.Col>
          <UiGrid.Col size={6} />
          <UiGrid.Col size={6}>
            <ReportList reports={reports} onClick={setSelectedReport} activeReport={selectedReport} />
          </UiGrid.Col>
          <UiGrid.Col size={6}>
            {selectedReport !== null ?
              <ReportItem report={selectedReport} />
              : ''
            }
          </UiGrid.Col>
        </UiGrid>
      </UiContainer>
    </SessionOnly>
  )
}
export default MeldungenPage

type Query = {
  id: string
}

export const getServerSideProps: GetServerSideProps<Props, Query> = async ({ params }) => {
  if (params === undefined) {
    throw new Error('params is undefined')
  }

  const incidentId = parseInt(params.id)
  if (isNaN(incidentId)) {
    return {
      notFound: true,
    }
  }

  const [incident, incidentError]: BackendResponse<Incident> = await BackendService.find(
    `incidents/${incidentId}`,
  )
  if (incidentError !== null) {
    throw incidentError
  }

  const [reports, reportsError]: BackendResponse<Report[]> = await BackendService.list(
    `incidents/${incidentId}/reports`,
  )
  if (reportsError !== null) {
    throw reportsError
  }

  const tasks = await reports.reduce(async (all, report) => {
    const [tasks, tasksError]: BackendResponse<Task[]> = await BackendService.list(
      `incidents/${incidentId}/reports/${report.id}/tasks`,
    )
    if (tasksError !== null) {
      throw tasksError
    }
    return [...(await all), ...tasks]
  }, Promise.resolve([] as Task[]))


  const [users, usersError]: BackendResponse<User[]> = await BackendService.list('users')
  if (usersError !== null) {
    throw usersError
  }

  return {
    props: {
      data: {
        incident,
        reports,
        tasks,
        users,
      },
    },
  }
}

const StyledDiv = styled.div`
  display: flex;
  justify-content: space-between;
`
