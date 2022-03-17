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

const SessionStore = createStore(initialState, (getState, setState) => ({
  setSession(token: string, currentUser: User) {
    currentToken = token
    localStorage.setItem(storageKey, token)
    SessionStore.setCurrentUser(currentUser)
  },
  setCurrentUser(currentUser: User) {
    UserStore.save(currentUser)
    setState({
      session: {
        currentUser,
      },
    })
  },
  clear() {
    currentToken = null
    localStorage.removeItem(storageKey)
    setState({ session: { currentUser: null }})
  },
}))
export default SessionStore


export const useSession = (): Session => {
  const { session } = useStore(SessionStore)
  return session === null
    ? { currentUser: null }
    : session
}

export const useCurrentUser = (): User => {
  const { currentUser } = useSession()
  if (currentUser === null) {
    throw new Error('not signed in')
  }
  return currentUser
}

const storageKey = 'session.token'

/**
 * The current session token. This value is always in sync with both the store and localStorage,
 * except when local storage is modified by something outside this module,
 * which would require a page reload.
 */
let currentToken = process.browser ? localStorage.getItem(storageKey) : null

export const getSessionToken = (): string | null => currentToken