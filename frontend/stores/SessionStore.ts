import User from '@/models/User'
import { createStore } from '@/stores/base/Store'
import Session from '@/models/Session'
import UserStore from '@/stores/UserStore'
import { useStore } from '@/stores/base/hooks'

interface SessionState {
  session: Session | null
}

const initialState: SessionState = {
  session: null,
}

/**
 * `SessionStore` manage the current {@link Session}.
 */
const SessionStore = createStore(initialState, (getState, setState) => ({
  setCurrentUser(currentUser: User) {
    UserStore.save(currentUser)
    setState({
      session: {
        currentUser,
      },
    })
  },
  clear({ silent = false }: { silent?: boolean } = {}) {
    if (silent) {
      // Update the state, but don't rerender when `silent == true`.
      getState().session = { currentUser: null }
    } else {
      setState({ session: { currentUser: null }})
    }
  },
}))
export default SessionStore

/**
 * `useSession` is a React hook which loads the session from {@link SessionStore}.
 * It re-renders whenever the session is changed.
 *
 * @return The session.
 */
export const useSession = (): Session => {
  const { session } = useStore(SessionStore)
  return session === null
    ? { currentUser: null }
    : session
}

/**
 * `useCurrentUser` is a React hook that loads the current user from the {@link Session}.
 * It will cause an error if there is no active session.
 *
 * @return The current user.
 */
export const useCurrentUser = (): User => {
  const { currentUser } = useSession()
  if (currentUser === null) {
    throw new Error('not signed in')
  }
  return currentUser
}
