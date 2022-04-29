import React from 'react'
import { isAdmin } from '@/models/User'
import UiList from '@/components/Ui/List/UiList'
import UiModal from '@/components/Ui/Modal/UiModal'
import UiCreatButton from '@/components/Ui/Button/UiCreateButton'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiSortButton from '@/components/Ui/Button/UiSortButton'
import useSort from '@/utils/hooks/useSort'
import { useCurrentUser } from '@/stores/SessionStore'
import Organization from '@/models/Organization'
import OrganizationForm from '@/components/Organization/Form/OrganizationForm'
import OrganizationListItem from '@/components/Organization/List/Item/OrganizationListItem'

interface Props {
  organizations: readonly Organization[]
}

const OrganizationList: React.VFC<Props> = ({ organizations }) => {
  const currentUser = useCurrentUser()

  const [sortedOrganizations, sort] = useSort(organizations, () => ({
    name: String,
    userNumber: ({ userIds: a },  { userIds: b }) => {
      if (a.length === b.length) {
        return 0
      }
      if (a.length < b.length) {
        return -1
      } else {
        return 1
      }
    },
  }))

  return (
    <div>
      {isAdmin(currentUser) && (
        <UiModal title="Organisation erfassen">
          <UiModal.Trigger>{({ open }) => (
            <UiCreatButton onClick={open}>
              <UiIcon.CreateAction size={1.4} />
            </UiCreatButton>
          )}</UiModal.Trigger>
          <UiModal.Body>{({ close }) => (
            <OrganizationForm onClose={close} />
          )}</UiModal.Body>
        </UiModal>
      )}

      <UiGrid style={{ padding: '0.5rem' }} gapH={0.5}>
        <UiGrid.Col size={6}>
          <UiSortButton field={sort.name}>
            <UiTitle level={6}>Organisation</UiTitle>
          </UiSortButton>
        </UiGrid.Col>
        <UiGrid.Col size={6}>
          <UiSortButton field={sort.userNumber}>
            <UiTitle level={6}>Anzahl Benutzer</UiTitle>
          </UiSortButton>
        </UiGrid.Col>
      </UiGrid>
 
      <UiList>
        {sortedOrganizations.map((organization) => (
          <OrganizationListItem
            key={organization.id}
            organization={organization}
          />
        ))}
      </UiList>
    </div>
  )
}
export default OrganizationList
