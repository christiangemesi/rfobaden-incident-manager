import UiContainer from '@/components/Ui/Container/UiContainer'
import React from 'react'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import Incident, { parseIncident } from '@/models/Incident'
import IncidentStore, { useIncidents } from '@/stores/IncidentStore'
import { GetServerSideProps } from 'next'
import { useEffectOnce } from 'react-use'
import BackendService, { BackendResponse } from '@/services/BackendService'
import IncidentList from '@/components/Incident/List/IncidentList'
import IncidentForm from '@/components/Incident/Form/IncidentForm'

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

  return (
    <UiContainer>
      <h1>
        Ereignis verwalten
      </h1>
      <UiGrid style={{ justifyContent: 'center' }}>
        <UiGrid.Col size={{ md: 10, lg: 8, xl: 6 }}>
          <IncidentList incidents={incidents}/>
          {/*TODO Make some space between*/}
          <IncidentForm/>
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
