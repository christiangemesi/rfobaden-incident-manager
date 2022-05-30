import User from '@/models/User'

/**
 * `Session` represents the session of the current user.
 */
export default interface Session {
  /**
   * The current user.
   */
  currentUser: User | null
}

/**
 * `SessionResponse` represents a session's response.
 */
export interface SessionResponse {
  /**
   * The session's user.
   */
  user?: User | null
}
