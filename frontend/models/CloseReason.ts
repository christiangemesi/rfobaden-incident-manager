import { parseDate } from '@/models/base/Date'

/**
 * `CloseReason` represents a reason why an {@link Incident} was closed.
 */
export default interface CloseReason {
  /**
   * The close message.
   */
  message: string

  /**
   * Point in time at which the `CloseReason` has been created.
   */
  createdAt: Date

  /**
   * The `CloseReason` entered before this one, if it exists.
   */
  previous: CloseReason | null
}

/**
 * Parses a close reason's JSON structure.
 *
 * @param closeReason The close reason to parse.
 * @return The parsed close reason.
 */
export const parseCloseReason = (closeReason: CloseReason): CloseReason => {
  return {
    ...closeReason,
    createdAt: parseDate(closeReason.createdAt),
    previous: closeReason.previous && parseCloseReason(closeReason.previous),
  }
}
