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

const SessionStore = createStore(initialState, (state, update) => ({
  setCurrentUser(currentUser: User) {
    UserStore.save(currentUser)
    update(() => {
      state.session = { currentUser }
    })
  },
  clear({ silent = false }: { silent?: boolean } = {}) {
    if (silent) {
      // Update the state, but don't rerender when `silent == true`.
      state.session = { currentUser: null }
    } else {
      update(() => {
        state.session = { currentUser: null }
      })
    }
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
