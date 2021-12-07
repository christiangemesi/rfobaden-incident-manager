import React from 'react'
import { ClosedIncident } from '@/models/Incident'
import UiList from '@/components/Ui/List/UiList'
import UiListItem from '@/components/Ui/List/Item/UiListItem'
import UiDate from '@/components/Ui/Date/UiDate'
import UiGrid from '@/components/Ui/Grid/UiGrid'

interface Props {
  incidents: ClosedIncident[]
}

const IncidentArchiveList: React.VFC<Props> = ({ incidents }) => {
  return (
    <UiList>
      {incidents.map((incident) => (
        <UiListItem key={incident.id}>
          <UiGrid gapH={1.5}>
            <UiGrid.Col size={4}>
              <span>{incident.title}</span>
            </UiGrid.Col>
            <UiGrid.Col size={2}>
              <UiDate value={incident.startsAt ?? incident.createdAt} />
            </UiGrid.Col>
            <UiGrid.Col size={2}>
              <UiDate value={incident.closeReason.createdAt} />
            </UiGrid.Col>
            <UiGrid.Col>
              <span>{incident.closeReason.message}</span>
            </UiGrid.Col>
          </UiGrid>
        </UiListItem>
      ))}
    </UiList>
  )
}
export default IncidentArchiveList
