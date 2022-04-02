import User from '@/models/User'

export default interface Session {
  currentUser: User | null
}

export interface SessionResponse {
  user: User | null
}

