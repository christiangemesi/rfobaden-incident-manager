import React, { useMemo } from 'react'
import Incident from '@/models/Incident'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import styled from 'styled-components'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UiDateLabel from '@/components/Ui/DateLabel/UiDateLabel'
import UiBadge from '@/components/Ui/Badge/UiBadge'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import { useReportsOfIncident } from '@/stores/ReportStore'
import Link from 'next/link'

interface Props {
  incidents: Incident[]
}

const IncidentCards: React.VFC<Props> = ({ incidents }) => {

  return (
    <UiGrid gap={1.5}>
      {incidents.map((incident) => {
        return (
          <UiGrid.Col key={incident.id} size={4}>
            <IncidentCard incident={incident} />
          </UiGrid.Col>
        )
      })}
    </UiGrid>
  )
}
export default IncidentCards

interface IncidentCardProps {
  incident: Incident
}


const IncidentCard: React.VFC<IncidentCardProps> = ({ incident }) => {
  const reports = useReportsOfIncident(incident.id)
  const keyMessageCount = useMemo(() => (
    reports.filter(({ isKeyReport }) => isKeyReport).length
  ))

  return (
    <Link href={`/ereignisse/${incident.id}/meldungen`}>
      <A>
        <Card>
          <div>
            <UiGrid align="center" style={{ height: '8rem' }}>
              <UiGrid.Col size={8}>
                <UiBadge value={10}><UiIcon.Organization /></UiBadge>
                <br />
                <UiBadge value={keyMessageCount}><UiIcon.KeyMessage /></UiBadge>
              </UiGrid.Col>
              <UiGrid.Col size={4} style={{ textAlign: 'center' }}>
                <IncidentProgress incident={incident} />
              </UiGrid.Col>
            </UiGrid>
          </div>
          <div>
            <UiDateLabel start={incident.startsAt ?? incident.createdAt} end={incident.endsAt} />
            <UiTitle level={5}>{incident.title}</UiTitle>
          </div>
        </Card>
      </A>
    </Link>
  )
}

const A = styled.a``

const Card = styled.span`
  color: ${({ theme }) => theme.colors.primary.value};
  background-color: ${({ theme }) => theme.colors.primary.contrast};
  padding: 1rem;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 15rem;
  border: 2px solid ${({ theme }) => theme.colors.primary.value};
  
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);

  transition: 250ms ease;
  transition-property: filter, box-shadow;

  :hover:not(&[disabled]) {
    cursor: pointer;
    filter: brightness(90%);
  }

  :active:not(&[disabled]) {
    cursor: pointer;
    box-shadow: none;
    filter: brightness(75%);
  }
`
const IncidentProgress: React.VFC<IncidentCardProps> = ({ incident }) => {
  return (
    <Container>
      <Mask>
        <Fill>
          <span>10%</span>
        </Fill>
      </Mask>
    </Container>
  )
}

const Container = styled.div`
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  height: 8rem;
  width: 8rem;
  background-color: red;
`

const Mask = styled.div`
  position: absolute;
  border-radius: 50%;
  height: 8rem;
  width: 8rem;
`

const Fill = styled.div`
  position: absolute;
  border-radius: 50%;
  height: 8rem;
  width: 8rem;
  background-color: pink;
`