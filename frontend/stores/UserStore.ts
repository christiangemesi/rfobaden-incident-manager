import { parseUser } from '@/models/User'
import { createModelStore } from '@/stores/base/Store'
import { createUseRecord, createUseRecords } from '@/stores/base/hooks'

const UserStore = createModelStore(parseUser)

export default UserStore

export const useUser = createUseRecord(UserStore)
export const useUsers = createUseRecords(UserStore)

