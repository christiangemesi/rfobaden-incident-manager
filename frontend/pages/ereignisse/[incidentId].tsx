import Report, { parseReport } from '@/models/Report'
import React, { useCallback, useMemo } from 'react'
import ReportStore, { useReportsOfIncident } from '@/stores/ReportStore'
import UiContainer from '@/components/Ui/Container/UiContainer'
import { GetServerSideProps } from 'next'
import BackendService, { BackendResponse } from '@/services/BackendService'
import Incident, { parseIncident } from '@/models/Incident'
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
import ReportForm from '@/components/Report/Form/ReportForm'
import UiCaption from '@/components/Ui/Caption/UiCaption'
import UiDescription from '@/components/Ui/Description/UiDescription'
import UiLabelList from '@/components/Ui/Label/List/UiLabelList'
import UiLabel from '@/components/Ui/Label/UiLabel'

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

  const handleDelete = useCallback(async () => {
    if (confirm(`Sind sie sicher, dass sie das Ereignis "${incident.title}" löschen wollen?`)) {
      await BackendService.delete('incidents', incident.id)
      await router.push('/ereignisse')
      IncidentStore.remove(incident.id)
    }
  }, [incident, router])

  const handleClose = useCallback(async () => {
    const message = prompt(`Sind sie sicher, dass sie das Ereignis "${incident.title}" schliessen wollen?\nGrund:`)
    if (message === null) {
      return
    }
    if (message.trim().length === 0) {
      confirm(`Das Ereignis "${incident.title}" wurde nicht geschlossen.\nDie Begründung fehlt.`)
      return
    }
    const [data, error]: BackendResponse<Incident> = await BackendService.update(`incidents/${incident.id}/close`, { message })
    if (error !== null) {
      throw error
    }
    IncidentStore.save(parseIncident(data))
  }, [incident])

  const handleReopen = useCallback(async () => {
    if (confirm(`Sind sie sicher, dass sie das Ereignis "${incident.title}" wieder öffnen wollen?`)) {
      const [data, error] = await BackendService.update<number, Incident>(`incidents/${incident.id}/reopen`, incident.id)
      if (error !== null) {
        throw error
      }
      IncidentStore.save(parseIncident(data))
    }
  }, [incident])

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

  const startsAt = useMemo(() => (
    incident.startsAt !== null ? incident.startsAt : incident.createdAt
  ), [incident])

  // Shows
  const isFullDay = useMemo(() => {
    if (incident.startsAt !== null && !isDateWithoutTime(incident.startsAt)) {
      return false
    }
    if (incident.endsAt !== null && !isDateWithoutTime(incident.endsAt)) {
      return false
    }
    return true
  }, [incident])

  return (
    <Container>
      <Heading>
        <UiGrid justify="space-between" align="start" gap={1} style={{ flexWrap: 'nowrap' }}>
          <UiGrid.Col>
            <UiCaption>
              Ereignis
            </UiCaption>
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
                  <UiDropDown.Item onClick={open}>
                    Neue Meldung
                  </UiDropDown.Item>
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
              {incident.isClosed ? (
                <UiDropDown.Item onClick={handleReopen}>
                  Öffnen
                </UiDropDown.Item>
              ) : (
                <UiDropDown.Item onClick={handleClose}>
                  Schliessen
                </UiDropDown.Item>
              )}
              <UiDropDown.Item onClick={handleDelete}>Löschen</UiDropDown.Item>
            </UiDropDown>
          </UiGrid.Col>
        </UiGrid>

        <UiLabelList>
          <UiLabel>
            <UiIcon.UserInCircle />
            {activeOrganisations.length}
            &nbsp;
            {activeOrganisations.length === 1 ? 'Organisation' : 'Organisationen'}
          </UiLabel>
          <UiLabel>
            <UiIcon.Clock />
            <UiDateLabel start={startsAt} end={incident.endsAt} type={isFullDay ? 'date' : 'datetime'} />
          </UiLabel>
        </UiLabelList>

        <UiDescription description={incident.description} />

        {/*<UiGrid.Col size={{ lg: 6, xs: 12 }}>*/}
        {/*  <UiTextWithIcon text={*/}
        {/*    activeOrganisations.length === 0*/}
        {/*      ? 'Keine Organisationen beteiligt'*/}
        {/*      : activeOrganisations.reduce((a, b) => a + ', ' + b)*/}
        {/*  }>*/}
        {/*    <UiIcon.UserInCircle />*/}
        {/*  </UiTextWithIcon>*/}
        {/*</UiGrid.Col>*/}
      </Heading>
      <Content>
        <ReportList reports={reports} />
      </Content>
    </Container>
  )
}
export default IncidentPage

const isDateWithoutTime = (date: Date): boolean => (
  date.getHours() === 0 && date.getMinutes() === 0 && date.getSeconds() === 0
)

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

const Heading = styled(UiContainer)`
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
  
  margin-top: -2rem;
  padding-bottom: 1rem;
  z-index: 7;
`

const Content = styled.div`
  flex: 1;
  display: flex;
  //overflow: auto;
`
