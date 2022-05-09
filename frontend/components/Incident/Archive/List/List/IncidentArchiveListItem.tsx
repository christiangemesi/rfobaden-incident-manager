import React from 'react'
import { StyledProps } from '@/utils/helpers/StyleHelper'
import UiListItem from '@/components/Ui/List/Item/UiListItem'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiDate from '@/components/Ui/Date/UiDate'
import { ClosedIncident } from '@/models/Incident'

interface Props extends StyledProps {
  closedIncident: ClosedIncident
}

const IncidentArchiveListItem: React.VFC<Props> = ({
  closedIncident,
}) => {
  return (
    <UiListItem href={`/ereignisse/${closedIncident.id}`}>
      <UiGrid align="center" gapH={1.5}>
        <UiGrid.Col size={4}>
          <UiTitle level={5}>
            {closedIncident.title}
          </UiTitle>
        </UiGrid.Col>
        <UiGrid.Col size={2}>
          <UiTitle level={6}>
            <UiDate value={closedIncident.startsAt ?? closedIncident.createdAt} />
          </UiTitle>
        </UiGrid.Col>
        <UiGrid.Col size={2}>
          <UiTitle level={6}>
            <UiDate value={closedIncident.closeReason.createdAt} />
          </UiTitle>
        </UiGrid.Col>
        <UiGrid.Col>
          <UiTitle level={6}>
            {closedIncident.closeReason.message}
          </UiTitle>
        </UiGrid.Col>
      </UiGrid>
    </UiListItem>
      
  )
}
export default IncidentArchiveListItem
