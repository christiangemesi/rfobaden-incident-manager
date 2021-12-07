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
            <UiGrid.Col size={8}>

              <UiBadge value={10}>
                <UiIcon.Organization />
              </UiBadge>
              <div style={{ marginTop: '1rem' }} />
              <UiBadge value={keyMessageCount}>
                <UiIcon.KeyMessage />
              </UiBadge>

            </UiGrid.Col>
            <UiGrid.Col size={4} style={{ textAlign: 'center' }}>

              <ProgressCircle>
                <ProgressCircleMask>
                  <ProgressCircleFill>
                    <span>10%</span>
                  </ProgressCircleFill>
                </ProgressCircleMask>
              </ProgressCircle>

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
const ProgressCircle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  
  height: 8rem;
  width: 8rem;
  border-radius: 50%;
  
  background-color: red;
`
const ProgressCircleMask = styled.div`
  position: absolute;
  height: 8rem;
  width: 8rem;
  border-radius: 50%;
`
const ProgressCircleFill = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  
  height: 8rem;
  width: 8rem;
  border-radius: 50%;
  background-color: pink;
`
