import { createModelStore } from '@/stores/base/Store'
import { createUseRecord, createUseRecords } from '@/stores/base/hooks'
import { parseTrailer } from '@/models/Trailer'

/**
 * {@code TrailerStore} manages all loaded {@link Trailer trailers}.
 */
const TrailerStore = createModelStore(parseTrailer, {
  sortBy: (trailer) => [
    trailer.name.toLowerCase(),
  ],
})
export default TrailerStore

/**
 * {@code useTrailer} is a React hook which loads a specific trailer from {@link TrailerStore}.
 * It re-renders whenever the trailer is changed.
 *
 * @param id The id of the trailer.
 * @return The trailer.
 */
export const useTrailer = createUseRecord(TrailerStore)


/**
 * {@code useTrailers} is a React hook that loads all trailers from {@link TrailerStore}.
 * It re-renders whenever the store is modified.
 *
 * @param idsOrTransform? An list of ids to load, or a function that modifies the returned list.
 * @return The list of trailer.
 */
export const useTrailers = createUseRecords(TrailerStore)

