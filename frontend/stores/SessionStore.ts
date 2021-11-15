import User from '@/models/User'
import { createStore, useStore } from '@/stores/Store'
import Session from '@/models/Session'

const initialState: Session = {
  currentUser: null,
}

const SessionStore = createStore(initialState, (getState, setState) => ({
  setSession(token: string, currentUser: User) {
    currentToken = token
    localStorage.setItem(storageKey, token)
    setState((state) => ({
      ...state,
      currentUser,
    }))
  },
  clear() {
    currentToken = null
    localStorage.removeItem(storageKey)
    setState(initialState)
  },
}))
export default SessionStore

export const useSession = (): Session => (
  useStore(SessionStore)
)

const storageKey = 'session.token'

/**
 * The current session token. This value is always in sync with both the store and localStorage,
 * except when local storage is modified by something outside this module,
 * which would require a page reload.
 */
let currentToken = process.browser ? localStorage.getItem(storageKey) : null

export const getSessionToken = (): string | null => currentToken