import User from '@/models/User'
import { createStore, useStore } from '@/stores/Store'

interface Session {
  currentUser: User | null
}

const initialState: Session = {
  currentUser: null,
}

const SessionStore = createStore(initialState, (getState, setState) => ({
  setCurrentUser(user: User) {
    setState((state) => ({
      ...state,
      currentUser: user,
    }))
  },
  clear() {
    setState(initialState)
  },
}))
export default SessionStore

export const useSession = (): Session => (
  useStore(SessionStore)
)
