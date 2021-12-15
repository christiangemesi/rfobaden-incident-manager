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
          <UiGrid align="center" style={{ height: '8rem' }}>
            <UiGrid.Col size={6}>

              <UiBadge value={10}>
                <UiIcon.Organization />
              </UiBadge>
              <div style={{ marginTop: '1rem' }} />
              <UiBadge value={keyMessageCount}>
                <UiIcon.KeyMessage />
              </UiBadge>

            </UiGrid.Col>
            <UiGrid.Col size={6}>

              <UiCircularProgress value={10} />

            </UiGrid.Col>
          </UiGrid>
        </div>
        <div>

          <UiDateLabel
            start={incident.startsAt ?? incident.createdAt}
            end={incident.endsAt}
          />
          <UiTitle level={5}>
            {incident.title}
          </UiTitle>

        </div>
      </Container>
    </UiLink>
  )
}
export default IncidentListItem

const Container = styled.span`
  color: ${({ theme }) => theme.colors.primary.value};
  background-color: ${({ theme }) => theme.colors.primary.contrast};

  width: 100%;
  height: 15rem;
  padding: 1rem;

  border: 2px solid ${({ theme }) => theme.colors.primary.value};
  border-radius: 0.5rem;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);

  transition: 250ms ease;
  transition-property: filter, box-shadow;

  :hover:not(&[disabled]), :active:not(&[disabled]) {
    cursor: pointer;
    filter: brightness(90%);
  }

  :active:not(&[disabled]) {
    box-shadow: none;
  }
`
