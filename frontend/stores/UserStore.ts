import { parseUser } from '@/models/User'
import { createModelStore } from '@/stores/base/Store'
import { createUseRecord, createUseRecords } from '@/stores/base/hooks'

/**
 * `UserStore` manages all loaded {@link User users}.
 */
const UserStore = createModelStore(parseUser, {
  sortBy: (user) => [
    user.firstName.toLowerCase(),
    user.lastName.toLowerCase(),
    user.role,
    user.email.toLowerCase(),
  ],
})
export default UserStore

/**
 * `useUser` is a React hook which loads a specific user from {@link UserStore}.
 * It re-renders whenever the user is changed.
 *
 * @param id The id of the user.
 * @return The user.
 */
export const useUser = createUseRecord(UserStore)

/**
 * `useUsers` is a React hook that loads all users from {@link UserStore}.
 * It re-renders whenever the store is modified.
 *
 * @param idsOrTransform? An list of ids to load, or a function that modifies the returned list.
 * @return The list of users.
 */
export const useUsers = createUseRecords(UserStore)
