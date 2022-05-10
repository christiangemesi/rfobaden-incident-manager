import React from 'react'
import { ClosedIncident } from '@/models/Incident'
import UiList from '@/components/Ui/List/UiList'
import IncidentArchiveListItem from '@/components/Incident/Archive/List/List/IncidentArchiveListItem'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UiListHeader from '@/components/Ui/List/UiListHeader'

interface Props {
  closedIncidents: ClosedIncident[]
}

const IncidentArchiveList: React.VFC<Props> = ({ closedIncidents }) => {
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
            <UiTitle level={6}>Schliessdatum</UiTitle>
          </UiListHeader>
        </UiGrid.Col>
        <UiGrid.Col size={2}>
          <UiListHeader>
            <UiTitle level={6}>Begründung</UiTitle>
          </UiListHeader>
        </UiGrid.Col>
      </UiGrid>
    
      <UiList>
        {closedIncidents.map((closedIncident) => (
          <IncidentArchiveListItem 
            key={closedIncident.id}
            closedIncident={closedIncident}
          />
        ))}
      </UiList>
    </div>
  )
}
export default IncidentArchiveList
