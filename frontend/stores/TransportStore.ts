import { getPriorityIndex } from '@/models/Priority'
import { parseTransport } from '@/models/Transport'
import { createUseRecord, createUseRecords } from '@/stores/base/hooks'
import { createModelStore } from '@/stores/base/Store'

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
