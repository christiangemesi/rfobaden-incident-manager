import Incident from '@/models/Incident'
import React, { useMemo } from 'react'
import { useReportsOfIncident } from '@/stores/ReportStore'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiBadge from '@/components/Ui/Badge/UiBadge'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiDateLabel from '@/components/Ui/DateLabel/UiDateLabel'
import UiTitle from '@/components/Ui/Title/UiTitle'
import styled from 'styled-components'
import UiLink from '@/components/Ui/Link/UiLink'
import UiCircularProgress from '@/components/Ui/CircularProgress/UiCircularProgress'

interface IncidentCardProps {
  incident: Incident
}

const IncidentListItem: React.VFC<IncidentCardProps> = ({ incident }) => {
  const reports = useReportsOfIncident(incident.id)
  const keyMessageCount = useMemo(() => (
    reports.filter(({ isKeyReport }) => isKeyReport).length
  ), [reports])

  return (
    <UiLink href={`/ereignisse/${incident.id}`}>
      <Container>
        <div>
          <UiGrid align="stretch">
            <UiGrid.Col>
              <ProgressContainer>
                <UiCircularProgress done={incident.closedReportIds.length} total={incident.reportIds.length} />
              </ProgressContainer>
            </UiGrid.Col>
            <UiGrid.Col size="auto">
              <BadgeContainer>
                <UiBadge value={10}>
                  <UiIcon.Organization />
                </UiBadge>
                <UiBadge value={keyMessageCount}>
                  <UiIcon.KeyMessage />
                </UiBadge>
              </BadgeContainer>
            </UiGrid.Col>
          </UiGrid>
        </div>
        <div>
          <UiDateLabel
            start={incident.startsAt ?? incident.createdAt}
            end={incident.endsAt}
          />
          <ItemTitle level={5}>
            {incident.title}
          </ItemTitle>
        </div>
      </Container>
    </UiLink>
  )
}
export default IncidentListItem

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  width: 100%;
  height: 15rem;
  padding: 1.5rem 2rem;

  color: ${({ theme }) => theme.colors.secondary.contrast};
  background-color: ${({ theme }) => theme.colors.secondary.value};

  border-radius: 0.5rem;

  transition: 250ms ease;
  transition-property: filter;

  :hover:not(&[disabled]), :active:not(&[disabled]) {
    cursor: pointer;
    filter: brightness(90%);
  }

  :active:not(&[disabled]) {
      // TODO
  }
`

const ItemTitle = styled(UiTitle)`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`

const BadgeContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  padding: 1rem 0;
`

const ProgressContainer = styled.div`
  display: flex;
  justify-content: flex-start;
`