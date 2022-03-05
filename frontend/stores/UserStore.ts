import { parseUser } from '@/models/User'
import { createModelStore } from '@/stores/Store'
import { getPriorityIndex } from '@/models/Priority'
import { useOrganization } from '@/stores/OrganizationStore'
import { getOrganizationName } from '@/models/Organization'

const [UserStore, useUsers, useUser] = createModelStore(parseUser, {}, {
  sortBy: (user) => ['asc', [
    user.firstName.toLocaleLowerCase(),
    user.lastName.toLocaleLowerCase(),
    user.role,
    getOrganizationName(user.organizationId).then((response) => {response.toLocaleLowerCase()}),
  ]],
})
export default UserStore

export {
  useUsers,
  useUser,
}
