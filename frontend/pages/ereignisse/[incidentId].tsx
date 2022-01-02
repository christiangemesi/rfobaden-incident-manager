import Report, { parseReport } from '@/models/Report'
import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import ReportStore, { useReport, useReportsOfIncident } from '@/stores/ReportStore'
import UiContainer from '@/components/Ui/Container/UiContainer'
import { GetServerSideProps } from 'next'
import BackendService, { BackendResponse } from '@/services/BackendService'
import Incident from '@/models/Incident'
import IncidentStore, { useIncident } from '@/stores/IncidentStore'
import { useEffectOnce } from 'react-use'
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
import UiIconButton from '@/components/Ui/Icon/Button/UiIconButton'
import UiIconButtonGroup from '@/components/Ui/Icon/Button/Group/UiIconButtonGroup'
import * as ReactDOM from 'react-dom'
import IncidentView from '@/components/Incident/View/IncidentView'
import Task, { parseTask } from '@/models/Task'
import TaskStore from '@/stores/TaskStore'
import UiModal from '@/components/Ui/Modal/UiModal'
import ReportForm from '@/components/Report/Form/ReportForm'
import IncidentForm from '@/components/Incident/Form/IncidentForm'
import ReportView from '@/components/Report/View/ReportView'
import Id from '@/models/base/Id'
import { useRouter } from 'next/router'

interface Props {
  data: {
    incident: Incident
    reports: Report[]
    tasks: Task[]
    users: User[]
  }
}

const IncidentPage: React.VFC<Props> = ({ data }) => {
  useEffectOnce(() => {
    ReportStore.saveAll(data.reports.map(parseReport))
    UserStore.saveAll(data.users.map(parseUser))
    TaskStore.saveAll(data.tasks.map(parseTask))
  })

  const router = useRouter()

  const incident = useIncident(data.incident)
  const reports = useReportsOfIncident(incident.id)

  const [selectedReportId, setSelectedReportId] = useState<Id<Report> | null>(null)
  const selectedReport = useReport(selectedReportId)

  // TODO rewrite print page
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
    if (confirm(`Sind sie sicher, dass sie das Ereignis "${incident.title}" schliessen wollen?`)) {
      await BackendService.delete('incidents', incident.id)
      IncidentStore.remove(incident.id)
      await router.push('/ereignisse')
    }
  }

  // TODO Use actual organisations.
  const organisationList = ['Berufsfeuerwehr Baden', 'freiwillige Feuerwehr Baden', 'Werkhof Baden', 'Werkhof Turgi']//reports.map((report) => report.assigneeId)
  const organisations = organisationList.reduce((a, b) => a + ', ' + b)

  const startDate = useMemo(() => (
    incident.startsAt !== null ? incident.startsAt : incident.createdAt
  ), [incident])

  return (
    <UiContainer>
      <SpacerUiGrid gapH={2} gapV={1}>
        <BlockContainer>
          <UiTitle level={1}>
            {incident.title}
          </UiTitle>
        </BlockContainer>
        <VerticalSpacer>
          <HorizontalSpacer>
            <UiDateLabel start={startDate} end={incident.endsAt} type="datetime" />
            <UiIconButtonGroup>
              <UiIconButton onClick={handlePrint}>
                <UiIcon.PrintAction />
                {printer}
              </UiIconButton>
              <UiModal isFull>
                <UiModal.Activator>{({ open }) => (
                  <UiIconButton onClick={open}>
                    <UiIcon.EditAction />
                  </UiIconButton>
                )}</UiModal.Activator>
                <UiModal.Body>{({ close }) => (
                  <React.Fragment>
                    <UiTitle level={1} isCentered>
                      Ereignis bearbeiten
                    </UiTitle>
                    <IncidentForm incident={incident} onClose={close} />
                  </React.Fragment>
                )}</UiModal.Body>
              </UiModal>
              <UiIconButton onClick={handleDelete}>
                <UiIcon.DeleteAction />
              </UiIconButton>
            </UiIconButtonGroup>
          </HorizontalSpacer>
        </VerticalSpacer>
        <VerticalSpacer>
          <UiGrid.Col size={{ lg: 6, xs: 12 }}>
            {incident.description}
          </UiGrid.Col>
        </VerticalSpacer>
        <VerticalSpacer>
          <UiGrid.Col size={{ lg: 6, xs: 12 }}>
            <UiTextWithIcon text={organisations}>
              <UiIcon.UserInCircle />
            </UiTextWithIcon>
          </UiGrid.Col>
        </VerticalSpacer>
      </SpacerUiGrid>

      <UiGrid gapH={4}>

        <UiGrid.Col size={{ xs: 12, md: 6, lg: 5 }}>
          <Actions>
            <UiModal isFull>
              <UiModal.Activator>{({ open }) => (
                <UiActionButton onClick={open}>
                  <UiIcon.CreateAction />
                </UiActionButton>
              )}</UiModal.Activator>
              <UiModal.Body>{({ close }) => (
                <React.Fragment>
                  <UiTitle level={1} isCentered>
                    Meldung erfassen
                  </UiTitle>
                  <ReportForm incident={incident} onClose={close} />
                </React.Fragment>
              )}</UiModal.Body>
            </UiModal>
          </Actions>
          <ReportList reports={reports} onClick={(report) => setSelectedReportId(report.id)} activeReport={selectedReport} />
        </UiGrid.Col>

        <UiGrid.Col size={{ xs: 12, md: true }} style={{ marginTop: 'calc(56px + 0.5rem)' }}>
          {selectedReport !== null && (
            <ReportView report={selectedReport} />
          )}
        </UiGrid.Col>
      </UiGrid>
    </UiContainer>
  )
}
export default IncidentPage

type Query = {
  incidentId: string
}

export const getServerSideProps: GetServerSideProps<Props, Query> = async ({ params }) => {
  if (params === undefined) {
    throw new Error('params is undefined')
  }

  const incidentId = parseInt(params.incidentId)
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

const HorizontalSpacer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const VerticalSpacer = styled.div`
  width: 100%;
  margin-bottom: 1rem;

  :last-child {
    margin-bottom: 0;
  }
`
const SpacerUiGrid = styled(UiGrid)`
  margin-bottom: 2rem;
  margin-top: 2rem;
`

const BlockContainer = styled.div`
  width: 100%;
`

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
`
