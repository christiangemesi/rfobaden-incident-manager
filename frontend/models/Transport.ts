import Model from '@/models/base/Model'
import Incident from '@/models/Incident'
import Id from '@/models/base/Id'
import Trackable, { parseTrackable } from '@/models/Trackable'
import Vehicle from '@/models/Vehicle'
import Trailer from '@/models/Trailer'

export default interface Transport extends Model, Trackable {
  peopleInvolved: number
  driver: string | null
  vehicleId: Id<Vehicle> | null
  trailer: Id<Trailer> | null
  pointOfDeparture: string | null
  pointOfArrival: string | null
  incidentId: Id<Incident>
}

export const parseTransport = (data: Transport): Transport => ({
  ...data,
  ...parseTrackable(data),
})

export interface OpenTransport extends Transport {
  isClosed: false
}

export const isOpenTransport = (transport: Transport): transport is OpenTransport =>
  !transport.isClosed
