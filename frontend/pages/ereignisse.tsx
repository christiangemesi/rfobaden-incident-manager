import UiContainer from '@/components/Ui/Container/UiContainer'
import React, { useState } from 'react'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import Incident, { parseIncident } from '@/models/Incident'
import IncidentStore, { useIncidents } from '@/stores/IncidentStore'
import { GetServerSideProps } from 'next'
import { useEffectOnce } from 'react-use'
import BackendService, { BackendResponse } from '@/services/BackendService'
import IncidentList from '@/components/Incident/List/IncidentList'
import IncidentForm from '@/components/Incident/Form/IncidentForm'
import UiModal from '@/components/Ui/Modal/UiModal'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiActionButton from '@/components/Ui/Button/UiActionButton'
import IncidentCards from '@/components/Incident/List/IncidentCards'
import Report, { parseReport } from '@/models/Report'
import Task from '@/models/Task'
import ReportStore from '@/stores/ReportStore'

interface Props {
  data: {
    incidents: Incident[]
    reports: Report[]
  }
}

const EreignissePage: React.VFC<Props> = ({ data }) => {
  useEffectOnce(() => {
    IncidentStore.saveAll(data.incidents.map(parseIncident))
    ReportStore.saveAll(data.reports.map(parseReport))
  })

  const incidents = useIncidents()
  const closedIncidents = incidents.filter((incident) => incident.isClosed)
  const openIncidents = incidents.filter((incident) => !incident.isClosed)

  return (
    <UiContainer>
      {/* Title */}
      <UiTitle level={1}>
        Ereignisse
      </UiTitle>
      {/* Create Button */}
      <UiModal isFull>
        <UiModal.Activator>{({ open }) => (
          <UiActionButton onClick={open}>
            <UiIcon.CreateAction />
          </UiActionButton>
        )}</UiModal.Activator>
        <UiModal.Body>{({ close }) => (
          <UiContainer>
            <UiTitle level={1} isCentered>Ereignis erstellen</UiTitle>
            <IncidentForm onClose={close} />
          </UiContainer>
        )}</UiModal.Body>
      </UiModal>
      {/* Incident Cards */}
      <IncidentCards incidents={openIncidents} />
      {/* Closed Incidents List */}
      <UiTitle level={3}>Geschlossene Ereignisse</UiTitle>
      {/* Table Header */}
      <UiGrid style={{ padding: '0 1rem' }} gapH={1.5}>
        <UiGrid.Col size={4}>
          <UiTitle level={6}>Title</UiTitle>
        </UiGrid.Col>
        <UiGrid.Col size={2}>
          <UiTitle level={6}>Startdatum</UiTitle>
        </UiGrid.Col>
        <UiGrid.Col size={2}>
          <UiTitle level={6}>Schliessdatum</UiTitle>
        </UiGrid.Col>
        <UiGrid.Col>
          <UiTitle level={6}>Begründung</UiTitle>
        </UiGrid.Col>
      </UiGrid>
      <IncidentList incidents={closedIncidents} />
    </UiContainer>
  )
}
export default EreignissePage

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const [incidents, incidentsError]: BackendResponse<Incident[]> = await BackendService.list('incidents')
  if (incidentsError !== null) {
    throw incidentsError
  }

  const reports = await incidents.reduce(async (all, incident) => {
    const [reports, reportsError]: BackendResponse<Report[]> = await BackendService.list(
      `incidents/${incident.id}/reports`,
    )
    if (reportsError !== null) {
      throw reportsError
    }
    return [...(await all), ...reports]
  }, Promise.resolve([] as Report[]))

  return {
    props: {
      data: {
        incidents,
        reports,
      },
    },
  }
}
