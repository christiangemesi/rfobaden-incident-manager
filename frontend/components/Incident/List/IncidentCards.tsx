import React from 'react'
import Incident from '@/models/Incident'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import styled from 'styled-components'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UiDateLabel from '@/components/Ui/DateLabel/UiDateLabel'
import UiBadge from '@/components/Ui/Badge/UiBadge'
import UiIcon from '@/components/Ui/Icon/UiIcon'

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
  return (
    <Card>
      <div>
        <UiGrid align="center" style={{ height: '8rem' }}>
          <UiGrid.Col size={8}>
            <UiBadge value={10}><UiIcon.Organization /></UiBadge>
            <br />
            <UiBadge value={69}><UiIcon.KeyMessage /></UiBadge>
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
  )
}

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