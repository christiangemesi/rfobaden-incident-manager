import { createModelStore } from '@/stores/base/Store'
import Transport, { parseTransport } from '@/models/Transport'
import Incident from '@/models/Incident'
import Id from '@/models/base/Id'
import { createUseRecord, createUseRecords } from '@/stores/base/hooks'
import { getPriorityIndex } from '@/models/Priority'

const TransportStore = createModelStore(parseTransport, {
  sortBy: (Transport) => [
    // Closed Transports are always at the bottom.
    [Transport.isClosed, 'asc'],

    getPriorityIndex(Transport.priority),
    [Transport.startsAt ?? Transport.createdAt, 'asc'],
    Transport.id,
  ],
})
export default TransportStore

export const useTransport = createUseRecord(TransportStore)
export const useTransports = createUseRecords(TransportStore)

export const useTransportsOfIncident = (incidentId: Id<Incident>): readonly Transport[] =>
  useTransports((Transports) => Transports.filter((Transport) => Transport.incidentId === incidentId), [incidentId])
