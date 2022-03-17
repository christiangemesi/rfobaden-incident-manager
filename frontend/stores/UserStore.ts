import { parseUser } from '@/models/User'
import { createModelStore } from '@/stores/base/Store'
import { createUseRecord, createUseRecords } from '@/stores/base/hooks'

const UserStore = createModelStore(parseUser, {
  sortBy: (user) => [
    user.firstName.toLowerCase(),
    user.lastName.toLowerCase(),
    user.role,
  ],
})

export default UserStore

export const useUser = createUseRecord(UserStore)
export const useUsers = createUseRecords(UserStore)

