import { createModelStore } from '@/stores/base/Store'
import Transport, { parseTransport } from '@/models/Transport'
import Incident from '@/models/Incident'
import Id from '@/models/base/Id'
import { createUseRecord, createUseRecords } from '@/stores/base/hooks'
import { getPriorityIndex } from '@/models/Priority'

/**
 * `TransportStore` manages all loaded {@link Transport transports}.
 */
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

/**
 * `useTransport` is a React hook which loads a specific transport from {@link TransportStore}.
 * It re-renders whenever the user is changed.
 *
 * @param id The id of the transport.
 * @return The transport.
 */
export const useTransport = createUseRecord(TransportStore)

/**
 * `useTransports` is a React hook that loads all transports from {@link TransportStore}.
 * It re-renders whenever the store is modified.
 *
 * @param idsOrTransform? An list of ids to load, or a function that modifies the returned list.
 * @return The list of transports.
 */
export const useTransports = createUseRecords(TransportStore)

/**
 * `useTransportsOfIncident` is a React hook that loads all transports
 * belonging to a specific incident from {@link TransportStore}.
 * It re-renders whenever the store is modified.
 *
 * @param incidentId The id of the incident to which the transports belong.
 * @return The list of transports belonging to the incident.
 */
export const useTransportsOfIncident = (incidentId: Id<Incident>): readonly Transport[] =>
  useTransports((Transports) => Transports.filter((Transport) => Transport.incidentId === incidentId), [incidentId])
