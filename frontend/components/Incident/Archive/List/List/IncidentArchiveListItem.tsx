import React from 'react'
import { StyledProps } from '@/utils/helpers/StyleHelper'
import UiListItem from '@/components/Ui/List/Item/UiListItem'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiDate from '@/components/Ui/Date/UiDate'
import { ClosedIncident } from '@/models/Incident'

interface Props extends StyledProps {
  incident: ClosedIncident
}

const IncidentArchiveListItem: React.VFC<Props> = ({
  incident,
}) => {
  return (
    <UiListItem href={`/ereignisse/${incident.id}`}>
      <UiGrid align="center" gapH={1.5}>
        <UiGrid.Col size={4}>
          <UiTitle level={5}>
            {incident.title}
          </UiTitle>
        </UiGrid.Col>
        <UiGrid.Col size={2}>
          <UiTitle level={6}>
            <UiDate value={incident.startsAt ?? incident.createdAt} />
          </UiTitle>
        </UiGrid.Col>
        <UiGrid.Col size={2}>
          <UiTitle level={6}>
            <UiDate value={incident.closeReason.createdAt} />
          </UiTitle>
        </UiGrid.Col>
        <UiGrid.Col size={4}>
          <UiTitle level={6}>
            {incident.closeReason.message}
          </UiTitle>
        </UiGrid.Col>
      </UiGrid>
    </UiListItem>
      
  )
}
export default IncidentArchiveListItem
