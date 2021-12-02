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
import UiButton from '@/components/Ui/Button/UiButton'
import UiTitle from '@/components/Ui/Title/UiTitle'

interface Props {
  data: {
    incidents: Incident[]
  }
}

const EreignissePage: React.VFC<Props> = ({ data }) => {
  useEffectOnce(() => {
    IncidentStore.saveAll(data.incidents.map(parseIncident))
  })

  const incidents = useIncidents()

  const [currentIncident, setCurrentIncident] = useState<Incident | null>(null)

  const clearCurrentIncident = async () => {
    setCurrentIncident(null)
  }

  const handleEdit = async (incident: Incident) => {
    setCurrentIncident(incident)
  }

  return (
    <UiContainer>
      <h1>
        Ereignis verwalten
      </h1>
      <UiGrid style={{ justifyContent: 'center' }}>
        <UiGrid.Col size={{ md: 8, lg: 6, xl: 4 }}>

          <UiModal isFull>
            <UiModal.Activator>{({ open }) => (
              <UiButton onClick={open}>
                Ereignis erstellen
              </UiButton>
            )}</UiModal.Activator>
            <UiModal.Body>{({ close }) => (
              <UiContainer>
                <UiTitle level={1} isCentered>Ereignis erstellen</UiTitle>
                <IncidentForm incident={currentIncident} onClose={() => { close(); clearCurrentIncident() }} />
              </UiContainer>
            )}</UiModal.Body>
          </UiModal>

        </UiGrid.Col>
      </UiGrid>
      <UiGrid style={{ justifyContent: 'center' }}>
        <UiGrid.Col size={{ md: 10, lg: 8, xl: 6 }}>
          <IncidentList incidents={incidents} onEdit={handleEdit} />
        </UiGrid.Col>
      </UiGrid>
    </UiContainer>
  )
}
export default EreignissePage

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const [incidents]: BackendResponse<Incident[]> = await BackendService.list('incidents')
  return {
    props: {
      data: {
        incidents,
      },
    },
  }
}
