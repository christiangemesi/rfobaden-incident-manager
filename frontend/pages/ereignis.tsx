import UiContainer from '@/components/Ui/Container/UiContainer'
import React from 'react'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import Incident from '@/models/Incident'

interface Props {
    data: {
        incidents: Incident[]
    }
}

const BenutzerPage: React.VFC<Props> = () => {
    return (
        <UiContainer>
            <h1>
                Ereignis verwalten
            </h1>
            <UiGrid style={{ justifyContent: 'center' }}>
                <UiGrid.Col size={{ md: 10, lg: 8, xl: 6 }}>
                    <h1>
                        Ereignis Table
                    </h1>
                </UiGrid.Col>
            </UiGrid>
        </UiContainer>
    )
}
export default BenutzerPage
