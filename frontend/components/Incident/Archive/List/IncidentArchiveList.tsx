import React from 'react'
import { ClosedIncident } from '@/models/Incident'
import UiList from '@/components/Ui/List/UiList'
import IncidentArchiveListItem from '@/components/Incident/Archive/List/List/IncidentArchiveListItem'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UiListHeader from '@/components/Ui/List/UiListHeader'

interface Props {
  incidents: ClosedIncident[]
}

const IncidentArchiveList: React.VFC<Props> = ({ incidents }) => {
  return (
    <div>
      <UiGrid style={{ padding: '0 1rem' }} gapH={1.5}>
        <UiGrid.Col size={4}>
          <UiListHeader>
            <UiTitle level={6}>Ereignis</UiTitle>
          </UiListHeader>
        </UiGrid.Col>
        <UiGrid.Col size={2}>
          <UiListHeader>
            <UiTitle level={6}>Startdatum</UiTitle>
          </UiListHeader>
        </UiGrid.Col>
        <UiGrid.Col size={2}>
          <UiListHeader>
            <UiTitle level={6}>Abschlussdatum</UiTitle>
          </UiListHeader>
        </UiGrid.Col>
        <UiGrid.Col size={2}>
          <UiListHeader>
            <UiTitle level={6}>Begründung</UiTitle>
          </UiListHeader>
        </UiGrid.Col>
      </UiGrid>
    
      <UiList>
        {incidents.map((closedIncident) => (
          <IncidentArchiveListItem 
            key={closedIncident.id}
            incident={closedIncident}
          />
        ))}
      </UiList>
    </div>
  )
}
export default IncidentArchiveList
