import Incident from '@/models/Incident'
import React, { ReactNode } from 'react'
import UiLevel from '@/components/Ui/Level/UiLevel'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import IncidentInfo from '@/components/Incident/Info/IncidentInfo'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UiDescription from '@/components/Ui/Description/UiDescription'
import styled from 'styled-components'
import { StyledProps } from '@/utils/helpers/StyleHelper'
import IncidentActions from '@/components/Incident/Actions/IncidentActions'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiCircularProgress from '@/components/Ui/CircularProgress/UiCircularProgress'

interface Props extends StyledProps {
  incident: Incident
  children: ReactNode
  onDelete?: () => void
}

const IncidentView: React.VFC<Props> = ({
  incident,
  className,
  style,
  children,
  onDelete: handleDelete,
}) => {
  return (
    <UiLevel className={className} style={style}>
      <UiLevel.Header>
        <UiGrid justify="space-between" gap={1} style={{ flexWrap: 'nowrap' }}>
          <UiGrid.Col size={{ xs: 0, md: 'auto' }}>
            <UiCircularProgress done={incident.closedReportIds.length} total={incident.reportIds.length} />
          </UiGrid.Col>
          <UiGrid.Col size={{ xs: 10, md: true }}>
            <TitleContainer>
              <IncidentInfo incident={incident} />
              <UiTitle level={1}>
                {incident.title}
              </UiTitle>
              <UiDescription description={incident.description} />
            </TitleContainer>
          </UiGrid.Col>
          <UiGrid.Col size={{ xs: 2, md: 'auto' }}>
            <IncidentActions incident={incident} onDelete={handleDelete} />
            <UiIcon.Empty style={{ marginLeft: '1rem' }} />
          </UiGrid.Col>
        </UiGrid>
      </UiLevel.Header>
      <StyledUiLevelContent noPadding>
        {children}
      </StyledUiLevelContent>
    </UiLevel>
  )
}
export default styled(IncidentView)``

const StyledUiLevelContent = styled(UiLevel.Content)`
  overflow: hidden;
`

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  padding-bottom: 0.5rem;
`