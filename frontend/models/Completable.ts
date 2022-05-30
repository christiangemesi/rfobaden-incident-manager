import CloseReason, { parseCloseReason } from '@/models/CloseReason'

/**
 * `Completable` represents an entity that can be completed.
 */
export default interface Completable {
  /**
   * The close reason to complete.
   */
  completion: CloseReason | null

  /**
   * Whether the entity is completed.
   */
  isComplete: boolean
}

/**
 * Parses a completable entity's JSON structure.
 *
 * @param data The completable entity to parse.
 * @return The parsed completable entity.
 */
export const parseCompletable = ({ completion, isComplete }: Completable): Completable => ({
  completion: completion && parseCloseReason(completion),
  isComplete,
})
