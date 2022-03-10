import { parseUser } from '@/models/User'
import { createModelStore } from '@/stores/Store'

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
