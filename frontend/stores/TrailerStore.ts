import { createModelStore } from '@/stores/base/Store'
import { createUseRecord, createUseRecords } from '@/stores/base/hooks'
import { parseTrailer } from '@/models/Trailer'

const TrailerStore = createModelStore(parseTrailer, {
  sortBy: (trailer) => [
    trailer.name.toLowerCase(),
  ],
})

export default TrailerStore

export const useTrailer = createUseRecord(TrailerStore)
export const useTrailers = createUseRecords(TrailerStore)

