import UiContainer from '@/components/Ui/Container/UiContainer'
import React from 'react'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import Incident from '@/models/Incident'
import IncidentStore, {useIncidents} from '@/stores/IncidentStore'
import { GetServerSideProps } from 'next'
import { useEffectOnce } from 'react-use'
import BackendService, { BackendResponse } from '@/services/BackendService'
import Model from '@/models/base/Model'
import IncidentList from '@/components/Incident/List/IncidentList'

interface Props {
    data: {
        incidents: Incident[]
    }
}

const EreignisPage: React.VFC<Props> = ({ data }) => {
    useEffectOnce(() => {
        IncidentStore.saveAll(data.incidents)
    })

    const incidents = useIncidents()

    return (
        <UiContainer>
            <h1>
                Ereignis verwalten
            </h1>
            <UiGrid style={{ justifyContent: 'center' }}>
                <UiGrid.Col size={{ md: 10, lg: 8, xl: 6 }}>
                    <IncidentList incidents={incidents} />
                </UiGrid.Col>
            </UiGrid>
        </UiContainer>
    )
}
export default EreignisPage

export const getServerSideProps: GetServerSideProps<Props> = async () => {
    const [incidents]: BackendResponse<(Model & { title: string, isClosed: boolean })[]> = (await BackendService.list('incidents'))
    return {
        props: {
            data: {
                incidents: incidents.map((incident) => ({
                    id: incident.id,
                    title: incident.title,
                    isClosed: incident.isClosed,
                })),
            },
        },
    }
}
