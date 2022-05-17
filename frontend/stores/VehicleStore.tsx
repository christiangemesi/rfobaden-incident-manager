import { createModelStore } from '@/stores/base/Store'
import { parseVehicle } from '@/models/Vehicle'
import { createUseRecord, createUseRecords } from '@/stores/base/hooks'

const VehicleStore = createModelStore(parseVehicle, {
  sortBy: (vehicle) => [
    vehicle.name.toLowerCase(),
  ],
})

export default VehicleStore

export const useVehicle = createUseRecord(VehicleStore)
export const useVehicles = createUseRecords(VehicleStore)

