import { parseUser } from '@/models/User'
import { createModelStore } from '@/stores/Store'
import { getPriorityIndex } from '@/models/Priority'
import { useOrganization } from '@/stores/OrganizationStore'
import { getOrganizationName } from '@/models/Organization'

const [UserStore, useUsers, useUser] = createModelStore(parseUser, {}, {
  sortBy: (user) => ['asc', [
    user.firstName.toLowerCase(),
    user.lastName.toLowerCase(),
    user.role,
  ]],
})
export default UserStore

export {
  useUsers,
  useUser,
}
