import React from 'react'
import User from '@/models/User'
import UiList from '@/components/Ui/List/UiList'
import UiModal from '@/components/Ui/Modal/UiModal'
import UiCreatButton from '@/components/Ui/Button/UiCreateButton'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UserForm from '@/components/User/Form/UserForm'
import UserListItem from '@/components/User/List/Item/UserListItem'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiSortButton from '@/components/Ui/Button/UiSortButton'
import useSort from '@/utils/hooks/useSort'
import OrganizationStore from '@/stores/OrganizationStore'

interface Props {
  users: User[]
  onClick?: (user: User) => void
}

const UserList: React.VFC<Props> = ({ users , onClick: handleClick }) => {
  const [sortedUsers, sort] = useSort(users, () => ({
    firstName: String,
    lastName: String,
    role: String,
    organization: ({ organizationId: a },  { organizationId: b }) => {
      if (a === b){
        return 0
      }
      if (a === null) {
        return -1
      }
      if (b === null) {
        return 1
      }
      const aOrg = OrganizationStore.find(a)
      const bOrg = OrganizationStore.find(b)
      if (aOrg === null || bOrg === null) {
        throw new Error('organization not found')
      }
      return aOrg.name.localeCompare(bOrg.name)
    },
  }))

  return (
    <UiList>
      <UiModal isFull>
        <UiModal.Activator>{({ open }) => (
          <UiCreatButton onClick={open}>
            <UiIcon.CreateAction size={1.4} />
          </UiCreatButton>
        )}</UiModal.Activator>
        <UiModal.Body>{({ close }) => (
          <React.Fragment>
            <UiTitle level={1} isCentered>
              Benutzer erfassen
            </UiTitle>
            <UserForm onClose={close} />
          </React.Fragment>
        )}</UiModal.Body>
      </UiModal>
      <UiGrid style={{ padding: '0 1rem' }} gapH={1.5}>
        <UiGrid.Col size={2}>
          <UiSortButton field={sort.firstName}>
            <UiTitle level={6}>Vorname</UiTitle>
          </UiSortButton>
        </UiGrid.Col>
        <UiGrid.Col size={4}>
          <UiSortButton field={sort.lastName}>
            <UiTitle level={6}>Nachname</UiTitle>
          </UiSortButton>
        </UiGrid.Col>
        <UiGrid.Col size={2}>
          <UiSortButton field={sort.role}>
            <UiTitle level={6}>Rolle</UiTitle>
          </UiSortButton>
        </UiGrid.Col>
        <UiGrid.Col>
          <UiSortButton field={sort.organization}>
            <UiTitle level={6}>Organisation</UiTitle>
          </UiSortButton>
        </UiGrid.Col>
      </UiGrid>
      {sortedUsers.map((user) => (
        <UserListItem
          key={user.id}
          user={user}
        />
      ))}
    </UiList>
  )
}
export default UserList
