import Incident from '@/models/Incident'
import React from 'react'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiCircularProgress from '@/components/Ui/CircularProgress/UiCircularProgress'
import IncidentInfo from '@/components/Incident/Info/IncidentInfo'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UiDescription from '@/components/Ui/Description/UiDescription'
import IncidentActions from '@/components/Incident/Actions/IncidentActions'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import styled from 'styled-components'

interface Props {
  incident: Incident
  onDelete?: () => void
}

const IncidentViewHeader: React.VFC<Props> = ({ incident, onDelete: handleDelete }) => {
  return (
    <UiGrid justify="space-between" gap={1} style={{ flexWrap: 'nowrap' }}>
      <UiGrid.Col size={{ xs: 0, md: 'auto' }}>
        <UiCircularProgress done={incident.closedReportIds.length} total={incident.reportIds.length} />
      </UiGrid.Col>
      <UiGrid.Col size={{ xs: 10, md: true }}>
        <TitleContainer>
          <IncidentInfo incident={incident} />
          <div>
            <UiTitle level={1}>
              {incident.title}
            </UiTitle>
            <UiDescription description={incident.description} />
          </div>
        </TitleContainer>
      </UiGrid.Col>
      <UiGrid.Col size={{ xs: 2, md: 'auto' }}>
        <IncidentActions incident={incident} onDelete={handleDelete} />
        <UiIcon.Empty style={{ marginLeft: '1rem' }} />
      </UiGrid.Col>
    </UiGrid>
  )
}
export default IncidentViewHeader

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  height: 100%;
`

