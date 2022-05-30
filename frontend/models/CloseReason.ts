import { parseDate } from '@/models/base/Date'

/**
 * `CloseReason` represents a reason why an {@link Incident} was closed.
 */
export default interface CloseReason {
  /**
   * The message with the reason.
   */
  message: string

  /**
   * Date created the close reason.
   */
  createdAt: Date

  /**
   * The last close reason of the {@link Incident}, or `null`, if it is the first one.
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
