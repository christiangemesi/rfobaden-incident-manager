import Incident from '@/models/Incident'
import React, { ReactNode } from 'react'
import UiLevel from '@/components/Ui/Level/UiLevel'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import IncidentInfo from '@/components/Incident/Info/IncidentInfo'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UiDescription from '@/components/Ui/Description/UiDescription'
import styled from 'styled-components'
import { Themed } from '@/theme'
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
        <UiGrid justify="space-between" align="start" gap={1} style={{ flexWrap: 'nowrap' }}>
          <UiGrid.Col size={{ xs: 1, md: 9, xxl: 7 }}>
            <IncidentInfo incident={incident} />
            <UiTitle level={1}>
              {incident.title}
            </UiTitle>
            <UiDescription description={incident.description} />
          </UiGrid.Col>
          <UiGrid.Col size={{ xs: 0, md: 2, xxl: 7 }}>
            <ProgressContainer>
              <UiCircularProgress done={incident.closedReportIds.length} total={incident.reportIds.length} />
            </ProgressContainer>
          </UiGrid.Col>
          <UiGrid.Col size="auto">
            <IncidentActions incident={incident} onDelete={handleDelete} />
            <UiIcon.Empty style={{ marginLeft: '0.5rem' }} />
          </UiGrid.Col>
        </UiGrid>
      </UiLevel.Header>
      <StyledUiLevelContent>
        {children}
      </StyledUiLevelContent>
    </UiLevel>
  )
}
export default styled(IncidentView)``

const ProgressContainer = styled.div`
  margin-top: 2rem;
`

const StyledUiLevelContent = styled(UiLevel.Content)`
  overflow: hidden;
  ${Themed.media.lg.min} {
    display: flex;
    padding-right: 0;
  }

  ${Themed.media.md.max} {
    padding-left: 0;
    padding-right: 0;
  }
`
