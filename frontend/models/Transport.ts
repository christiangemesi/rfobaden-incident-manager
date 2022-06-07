import Model from '@/models/base/Model'
import Id from '@/models/base/Id'
import Trackable, { parseTrackable } from '@/models/Trackable'
import Vehicle from '@/models/Vehicle'
import Trailer from '@/models/Trailer'

/**
 * `Transport` represents a transport handled in an {@link Incident}.
 */
export default interface Transport extends Model, Trackable {
  /**
   * The number of people involved in the transport.
   */
  peopleInvolved: number

  /**
   * The name of the person which will drive the vehicle of this transport.
   */
  driver: string | null

  /**
   * The vehicle's id used in the transport.
   */
  vehicleId: Id<Vehicle> | null

  /**
   * The trailer's id used in the transport, or `null`, if none is needed.
   */
  trailerId: Id<Trailer> | null

  /**
   * The departure location of the transport.
   */
  pointOfDeparture: string | null

  /**
   * The arrival location of the transport.
   */
  pointOfArrival: string | null
}

/**
 * Parses a transport's JSON structure.
 *
 * @param data The transport to parse.
 * @return The parsed transport.
 */
export const parseTransport = (data: Transport): Transport => ({
  ...data,
  ...parseTrackable(data),
})

/**
 * `OpenTransport` represents a transport that is not {@link Transport.isClosed closed}.
 */
export interface OpenTransport extends Transport {
  isClosed: false
}

/**
 * Checks if a transport is an instance of {@link OpenTransport}.
 *
 * @param transport The transport.
 * @return Whether the transport is a {@link OpenTransport}.
 */
export const isOpenTransport = (transport: Transport): transport is OpenTransport =>
  !transport.isClosed
