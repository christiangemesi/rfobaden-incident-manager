import Model from '@/models/base/Model'
import { parseDate } from '@/models/base/Date'
import Id from '@/models/base/Id'
import BackendService, { BackendResponse } from '@/services/BackendService'

/**
 * `Trailer` represents a trailer usable in a {@link Transport}.
 */
export default interface Trailer extends Model {
  /**
   * Name of the trailer.
   */
  name: string

  /**
   * Whether the trailer is visible to users.
   */
  isVisible: boolean
}

/**
 * Parses a trailer's JSON structure.
 *
 * @param data The trailer to parse.
 * @return The parsed trailer.
 */
export const parseTrailer = (data: Trailer): Trailer => ({
  ...data,
  createdAt: parseDate(data.createdAt),
  updatedAt: parseDate(data.updatedAt),
})

/**
 * Loads the name of a trailer.
 *
 * @param trailerId The id of the trailer.
 * @return The trailer's name.
 */
export const getTrailerName = async (trailerId: Id<Trailer> | null): Promise<string> => {
  if (trailerId === null) {
    return ''
  }

  // Load the trailer with the id from the backend
  const [trailer, trailerError]: BackendResponse<Trailer> = await BackendService.find(
    `trailer/${trailerId}`,
  )
  if (trailerError !== null) {
    throw trailerError
  }

  return trailer.name
}