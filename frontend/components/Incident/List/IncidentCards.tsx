import React from 'react'
import Incident from '@/models/Incident'
import UiList from '@/components/Ui/List/UiList'
import UiListItem from '@/components/Ui/List/Item/UiListItem'
import UiDate from '@/components/Ui/Date/UiDate'
import CloseReason from '@/models/CloseReason'
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
        <UiGrid>
          <UiGrid.Col size={'auto'}>
            <UiBadge value={10}><UiIcon.Organization /></UiBadge>
            <br />
            <UiBadge value={69}><UiIcon.KeyMessage /></UiBadge>
          </UiGrid.Col>
          <UiGrid.Col>
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
    <span>10%</span>
  )
}