import User from '@/models/User'
import { createModelStore } from '@/stores/Store'

const [UserStore, useUsers, useUser] = createModelStore<User>()({})
export default UserStore

export {
  useUsers,
  useUser,
}
