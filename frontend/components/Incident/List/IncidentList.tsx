import React from 'react'
import Incident from '@/models/Incident'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import IncidentListItem from '@/components/Incident/List/Item/IncidentListItem'

interface Props {
  incidents: Incident[]
}

const IncidentList: React.VFC<Props> = ({ incidents }) => {
  return (
    <UiGrid gap={1.5}>
      {incidents.map((incident) => (
        <UiGrid.Col key={incident.id} size={4}>
          <IncidentListItem incident={incident} />
        </UiGrid.Col>
      ))}
    </UiGrid>
  )
}
export default IncidentList
