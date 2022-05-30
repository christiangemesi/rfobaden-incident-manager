import { createModelStore } from '@/stores/base/Store'
import Transport, { parseTransport } from '@/models/Transport'
import Incident from '@/models/Incident'
import Id from '@/models/base/Id'
import { createUseRecord, createUseRecords } from '@/stores/base/hooks'
import { getPriorityIndex } from '@/models/Priority'

const TransportStore = createModelStore(parseTransport, {
  sortBy: (transport) => [
    // Closed transports are always at the bottom.
    [transport.isClosed, 'asc'],

    // Sort order: priority > start date
    getPriorityIndex(transport.priority),
    [transport.startsAt ?? transport.createdAt, 'asc'],
    transport.id,
  ],
})
export default TransportStore

export const useTransport = createUseRecord(TransportStore)
export const useTransports = createUseRecords(TransportStore)

export const useTransportsOfIncident = (incidentId: Id<Incident>): readonly Transport[] =>
  useTransports((Transports) => Transports.filter((Transport) => Transport.incidentId === incidentId), [incidentId])
