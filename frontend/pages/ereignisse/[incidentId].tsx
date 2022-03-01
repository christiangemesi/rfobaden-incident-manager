import Report, { parseReport } from '@/models/Report'
import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import ReportStore, { useReportsOfIncident } from '@/stores/ReportStore'
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
import * as ReactDOM from 'react-dom'
import IncidentView from '@/components/Incident/View/IncidentView'
import { useTasks } from '@/stores/TaskStore'
import OrganizationStore, { useOrganizations } from '@/stores/OrganizationStore'
import Organization, { parseOrganization } from '@/models/Organization'
import { useSubtasks } from '@/stores/SubtaskStore'
import { useRouter } from 'next/router'
import UiDropDown from '@/components/Ui/DropDown/UiDropDown'
import UiModal from '@/components/Ui/Modal/UiModal'
import IncidentForm from '@/components/Incident/Form/IncidentForm'
import UiIconButton from '@/components/Ui/Icon/Button/UiIconButton'
import { useAppState } from '@/pages/_app'

interface Props {
  data: {
    incident: Incident
    reports: Report[]
    users: User[]
    organizations: Organization[]
  }
}

const IncidentPage: React.VFC<Props> = ({ data }) => {
  useEffectOnce(() => {
    ReportStore.saveAll(data.reports.map(parseReport))
    UserStore.saveAll(data.users.map(parseUser))
    OrganizationStore.saveAll(data.organizations.map(parseOrganization))
  })

  const [appState, setAppState] = useAppState()
  useEffectOnce(() => {
    setAppState({ ...appState, hasFooter: false })
  })

  const router = useRouter()

  const incident = useIncident(data.incident)
  const reports = useReportsOfIncident(incident.id)
  const subtasks = useSubtasks((subtasks) => (
    subtasks.filter((subtask) => subtask.incidentId === incident.id)
  ))
  const tasks = useTasks((tasks) => (
    tasks.filter((task) => task.incidentId === incident.id)
  ))

  // TODO re-add URL param for report
  // const selectedReportIdParam = router.query.report
  // const selectedReportId = useMemo(() => {
  //   if (selectedReportIdParam === undefined) {
  //     return null
  //   }
  //   return Array.isArray(selectedReportIdParam)
  //     ? parseInt(selectedReportIdParam[0])
  //     : parseInt(selectedReportIdParam)
  // }, [selectedReportIdParam])

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
      await router.push('/ereignisse')
      IncidentStore.remove(incident.id)
    }
  }

  const assigneeIds = new Set([
    ...reports.map((report) => report.assigneeId),
    ...tasks.map((task) => task.assigneeId),
    ...subtasks.map((subtask) => subtask.assigneeId),
  ])

  const activeOrganisations = useOrganizations((organizations) => (
    organizations
      .filter(({ userIds }) => userIds.some((id) => assigneeIds.has(id)))
      .map(({ name }) => name)
  ), [assigneeIds])

  const startDate = useMemo(() => (
    incident.startsAt !== null ? incident.startsAt : incident.createdAt
  ), [incident])

  return (
    <Container>
      <Heading>
        <UiContainer>
          <UiGrid align="center">
            <UiGrid.Col>
              <UiTitle level={1}>
                {incident.title}
              </UiTitle>
            </UiGrid.Col>
            <UiGrid.Col size="auto">
              <UiDropDown>
                <UiDropDown.Trigger>
                  <UiIconButton>
                    <UiIcon.More />
                  </UiIconButton>
                </UiDropDown.Trigger>

                <UiModal isFull>
                  <UiModal.Activator>{({ open }) => (
                    <UiDropDown.Item onClick={open}>Bearbeiten</UiDropDown.Item>
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

                <UiDropDown.Item onClick={handleDelete}>Löschen</UiDropDown.Item>
              </UiDropDown>
            </UiGrid.Col>
          </UiGrid>
          <VerticalSpacer>
            <HorizontalSpacer>
              <UiDateLabel start={startDate} end={incident.endsAt} type="datetime" />
            </HorizontalSpacer>
          </VerticalSpacer>
          <VerticalSpacer>
            <UiGrid.Col size={{ lg: 6, xs: 12 }}>
              {incident.description}
            </UiGrid.Col>
          </VerticalSpacer>
          <VerticalSpacer>
            <UiGrid.Col size={{ lg: 6, xs: 12 }}>
              <UiTextWithIcon text={
                activeOrganisations.length === 0
                  ? 'Keine Organisationen beteiligt'
                  : activeOrganisations.reduce((a, b) => a + ', ' + b)
              }>
                <UiIcon.UserInCircle />
              </UiTextWithIcon>
            </UiGrid.Col>
          </VerticalSpacer>
        </UiContainer>
      </Heading>
      <Content>
        <ReportList
          incident={incident}
          reports={reports}
        />
      </Content>
    </Container>
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

  const [organizations, organizationError]: BackendResponse<Organization[]> = await BackendService.list(
    'organizations',
  )
  if (organizationError !== null) {
    throw organizationError
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

  // const subtasks = await tasks.reduce(async (all, task) => {
  //   const [subtasks, subtasksError]: BackendResponse<Subtask[]> = await BackendService.list(
  //     `incidents/${incidentId}/reports/${task.reportId}/tasks/${task.id}/subtasks/`,
  //   )
  //   if (subtasksError !== null) {
  //     throw subtasksError
  //   }
  //   return [...(await all), ...subtasks]
  // }, Promise.resolve([] as Subtask[]))


  const [users, usersError]: BackendResponse<User[]> = await BackendService.list('users')
  if (usersError !== null) {
    throw usersError
  }

  return {
    props: {
      data: {
        incident,
        reports,
        users,
        organizations,
      },
    },
  }
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 7rem);
`

const Heading = styled.div`
  margin-top: -2rem;
  z-index: 7;
`

const Content = styled.div`
  flex: 1;
  display: flex;
  overflow: auto;
`

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

const BlockContainer = styled.div`
  width: 100%;
`

