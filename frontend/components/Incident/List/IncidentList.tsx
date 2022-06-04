import React from 'react'
import Incident from '@/models/Incident'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import IncidentListItem from '@/components/Incident/List/Item/IncidentListItem'
import IncidentCreateButton from '@/components/Incident/CreateButton/IncidentCreateButton'
import UiDrawer from '@/components/Ui/Drawer/UiDrawer'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import IncidentForm from '@/components/Incident/Form/IncidentForm'
import { useCurrentUser } from '@/stores/SessionStore'
import { isAdmin } from '@/models/User'

interface Props {
  incidents: Incident[]
}

const IncidentList: React.VFC<Props> = ({ incidents }) => {
  const currentUser = useCurrentUser()

  return (
    <UiGrid gap={1.5}>
      {incidents.map((incident) => (
        <UiGrid.Col key={incident.id} size={{ xs: 12, sm: 6, lg: 4, xxl: 3 }}>
          <IncidentListItem incident={incident} />
        </UiGrid.Col>
      ))}
      {isAdmin(currentUser) && (
        <UiGrid.Col size={{ xs: 12, sm: 6, lg: 4, xxl: 3 }}>
          <UiDrawer title="Ereignis erstellen" size="fixed">
            <UiDrawer.Trigger>{({ open }) => (
              <IncidentCreateButton onClick={open}>
                <UiIcon.CreateAction size={2} />
              </IncidentCreateButton>
            )}</UiDrawer.Trigger>
            <UiDrawer.Body>{({ close }) => (
              <IncidentForm onClose={close} />
            )}</UiDrawer.Body>
          </UiDrawer>
        </UiGrid.Col>
      )}
    </UiGrid>
  )
}
export default IncidentList