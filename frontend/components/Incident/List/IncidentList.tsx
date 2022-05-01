import React from 'react'
import Incident from '@/models/Incident'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import IncidentListItem from '@/components/Incident/List/Item/IncidentListItem'
import IncidentCreateButton from '@/components/Incident/CreateButton/IncidentCreateButton'
import UiModal from '@/components/Ui/Modal/UiModal'
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
    <UiGrid gap={1.5} justify="center">
      {incidents.map((incident) => (
        <UiGrid.Col key={incident.id} size={{ sm: 6, lg: 4, xxl: 3 }}>
          <IncidentListItem incident={incident} />
        </UiGrid.Col>
      ))}
      {isAdmin(currentUser) && (
        <UiGrid.Col size={{ sm: 6, lg: 4, xxl: 3 }}>
          <UiModal title="Ereignis erstellen">
            <UiModal.Trigger>{({ open }) => (
              <IncidentCreateButton onClick={open}>
                <UiIcon.CreateAction size={2} />
              </IncidentCreateButton>
            )}</UiModal.Trigger>
            <UiModal.Body>{({ close }) => (
              <IncidentForm onClose={close} />
            )}</UiModal.Body>
          </UiModal>
        </UiGrid.Col>
      )}
    </UiGrid>
  )
}
export default IncidentList