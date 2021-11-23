import { parseUser } from '@/models/User'
import { createModelStore } from '@/stores/Store'

const [UserStore, useUsers, useUser] = createModelStore(parseUser)
export default UserStore

export {
  useUsers,
  useUser,
}
