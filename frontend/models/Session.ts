import User from '@/models/User'

export default interface Session {
  currentUser: User | null
}

export interface SessionResponse {
  token: string
  user: User | null
}
