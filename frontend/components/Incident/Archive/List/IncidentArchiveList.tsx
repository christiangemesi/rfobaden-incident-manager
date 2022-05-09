import React from 'react'
import { ClosedIncident } from '@/models/Incident'
import UiList from '@/components/Ui/List/UiList'
import IncidentArchiveListItem from '@/components/Incident/Archive/List/List/IncidentArchiveListItem'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UiSortButton from '@/components/Ui/Button/UiSortButton'
import useSort from '@/utils/hooks/useSort'

interface Props {
  closedIncidents: ClosedIncident[]
}

const IncidentArchiveList: React.VFC<Props> = ({ closedIncidents }) => {
  const [sortedIncidents, sort] = useSort(closedIncidents, () => ({
    title: String,
    startDate: (incidentA, incidentB) => {
      const a = incidentA.startsAt ?? incidentA.createdAt
      const b = incidentB.startsAt ?? incidentB.createdAt

      if( a === b ){
        return 0
      }
      if ( a < b ) {
        return -1
      } else {
        return 1
      }
    },
    closeDate: ({ closeReason: a }, { closeReason: b }) => {
      const aClosed = a.createdAt
      const bClosed = b.createdAt

      if( aClosed === bClosed ){
        return 0
      }
      if ( aClosed < bClosed ) {
        return -1
      } else {
        return 1
      }
    },
    closeReason: ({ closeReason: a }, { closeReason: b }) => {
      console.log(a.message.localeCompare(b.message))
      return a.message.localeCompare(b.message)
    },
  }))

  return (
    <div>
      <UiGrid style={{ padding: '0 1rem' }} gapH={1.5}>
        <UiGrid.Col size={4}>
          <UiSortButton field={sort.title}>
            <UiTitle level={6}>Ereignis</UiTitle>
          </UiSortButton>
        </UiGrid.Col>
        <UiGrid.Col size={2}>
          <UiSortButton field={sort.startDate}>
            <UiTitle level={6}>Startdatum</UiTitle>
          </UiSortButton>
        </UiGrid.Col>
        <UiGrid.Col size={2}>
          <UiSortButton field={sort.closeDate}>
            <UiTitle level={6}>Schliessdatum</UiTitle>
          </UiSortButton>
        </UiGrid.Col>
        <UiGrid.Col>
          <UiSortButton field={sort.closeReason}>
            <UiTitle level={6}>Begründung</UiTitle>
          </UiSortButton>
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
